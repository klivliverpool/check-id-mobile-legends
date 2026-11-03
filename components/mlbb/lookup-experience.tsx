'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ErrorCard } from './error-card'
import { ResultCard, type PlayerResult } from './result-card'
import { SearchPanel, type FieldName } from './search-panel'

type ApiResponse = {
  success: boolean
  player?: PlayerResult
  error?: { code?: string; message?: string }
}

type ViewState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'result'; player: PlayerResult }
  | { kind: 'error'; message: string; code?: string }

function BrandMark() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="size-9 text-champagne">
      <path d="M24 4.5 39.5 13v17L24 43.5 8.5 30V13L24 4.5Z" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="m24 11 9.5 5.3v10.4L24 35l-9.5-8.3V16.3L24 11Z"
        fill="currentColor"
        fillOpacity=".14"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path d="m25.1 13.5-8 12h6.1l-1 8.8 8.7-13.1h-6.2l.4-7.7Z" fill="currentColor" />
    </svg>
  )
}

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { type: 'spring' as const, stiffness: 120, damping: 18, delay },
})

export function LookupExperience() {
  const [userId, setUserId] = useState('')
  const [zoneId, setZoneId] = useState('')
  const [view, setView] = useState<ViewState>({ kind: 'idle' })
  const [formError, setFormError] = useState('')
  const [invalidField, setInvalidField] = useState<FieldName | null>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (view.kind !== 'result' && view.kind !== 'error') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = window.setTimeout(() => {
      feedbackRef.current?.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'nearest',
      })
    }, 380)
    return () => window.clearTimeout(id)
  }, [view.kind])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    setInvalidField(null)

    const cleanUserId = userId.trim()
    const cleanZoneId = zoneId.trim()

    if (!/^[0-9]{3,12}$/.test(cleanUserId)) {
      setFormError('User ID harus berupa angka dengan panjang 3–12 digit.')
      setInvalidField('userId')
      return
    }
    if (!/^[0-9]{3,6}$/.test(cleanZoneId)) {
      setFormError('Zone ID harus berupa angka dengan panjang 3–6 digit.')
      setInvalidField('zoneId')
      return
    }

    setView({ kind: 'loading' })

    try {
      const response = await fetch(
        `/api/check?userId=${encodeURIComponent(cleanUserId)}&zoneId=${encodeURIComponent(cleanZoneId)}`,
        { method: 'GET', headers: { Accept: 'application/json' }, cache: 'no-store' },
      )
      const data = (await response.json()) as ApiResponse

      if (!response.ok || !data.success || !data.player) {
        setView({
          kind: 'error',
          message:
            data.error?.message ?? 'Akun tidak dapat ditemukan. Periksa kembali ID yang dimasukkan.',
          code: data.error?.code,
        })
        return
      }

      setView({ kind: 'result', player: data.player })
    } catch {
      setView({ kind: 'error', message: 'Koneksi ke layanan sedang terganggu. Coba lagi sebentar.' })
    }
  }

  function resetSearch() {
    setView({ kind: 'idle' })
    setFormError('')
    setInvalidField(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleUserIdChange(value: string) {
    setUserId(value.replace(/[^0-9]/g, '').slice(0, 12))
    if (invalidField === 'userId') {
      setInvalidField(null)
      setFormError('')
    }
  }

  function handleZoneIdChange(value: string) {
    setZoneId(value.replace(/[^0-9]/g, '').slice(0, 6))
    if (invalidField === 'zoneId') {
      setInvalidField(null)
      setFormError('')
    }
  }

  return (
    <MotionConfig reducedMotion="user" transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[640px] flex-col px-4 pb-10 pt-6 sm:px-6 sm:pt-8">
        <motion.header className="flex items-center justify-center gap-3" {...reveal(0.05)}>
          <BrandMark />
          <span className="text-[11px] font-semibold uppercase tracking-[0.42em] text-ivory/80">
            MLBB <span className="text-champagne">ID Checker</span>
          </span>
        </motion.header>

        <div className="flex flex-1 flex-col items-center justify-center py-10 sm:py-14">
          <motion.div className="mb-9 text-center sm:mb-12" {...reveal(0.12)}>
            <div className="mb-5 flex items-center justify-center gap-4">
              <span className="hairline w-10 sm:w-16" />
              <span className="eyebrow">Mobile Legends · Bang Bang</span>
              <span className="hairline w-10 sm:w-16" />
            </div>
            <h1 className="display text-[clamp(3.4rem,13vw,6.6rem)] leading-[0.88] text-ivory">
              <span className="block">Identity</span>
              <span className="gold-text block italic">Checker</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[34ch] text-[14px] leading-relaxed text-ivory/60 sm:text-[15px]">
              Temukan identitas akun Mobile Legends dalam satu pencarian.
            </p>
          </motion.div>

          <SearchPanel
            userId={userId}
            zoneId={zoneId}
            onUserIdChange={handleUserIdChange}
            onZoneIdChange={handleZoneIdChange}
            onSubmit={handleSubmit}
            loading={view.kind === 'loading'}
            formError={formError}
            invalidField={invalidField}
          />

          <div ref={feedbackRef} className="w-full scroll-mb-6">
            <AnimatePresence mode="wait">
              {view.kind === 'result' && (
                <div key="result" className="pt-5">
                  <ResultCard player={view.player} onReset={resetSearch} />
                </div>
              )}
              {view.kind === 'error' && (
                <div key="error" className="pt-5">
                  <ErrorCard
                    message={view.message}
                    code={view.code}
                    onRetry={() => setView({ kind: 'idle' })}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {view.kind === 'loading' ? 'Memeriksa akun' : ''}
          </p>
        </div>

        <motion.footer
          className="flex items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-ivory/35"
          {...reveal(0.9)}
        >
          <span>MLBB ID Checker</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-champagne/50" />
          <span>Fan-made tool</span>
        </motion.footer>
      </main>
    </MotionConfig>
  )
}
