'use client'

import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Fingerprint, Globe2, ScanSearch, TriangleAlert } from 'lucide-react'
import { GlassSurface } from './glass-surface'

export type FieldName = 'userId' | 'zoneId'

type SearchPanelProps = {
  userId: string
  zoneId: string
  onUserIdChange: (value: string) => void
  onZoneIdChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  loading: boolean
  formError: string
  invalidField: FieldName | null
}

const spring = { type: 'spring', stiffness: 380, damping: 26 } as const

function GlassField({
  id,
  label,
  index,
  icon,
  value,
  placeholder,
  maxLength,
  onChange,
  disabled,
  invalid,
  describedBy,
}: {
  id: string
  label: string
  index: string
  icon: React.ReactNode
  value: string
  placeholder: string
  maxLength: number
  onChange: (value: string) => void
  disabled: boolean
  invalid: boolean
  describedBy?: string
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2.5 flex items-center justify-between px-1">
        <span className="data-label">{label}</span>
        <span className="text-[10px] font-medium tracking-[0.2em] text-champagne/50 tabular-nums">
          {index}
        </span>
      </label>
      <div className="glass-inner-field flex items-center" data-invalid={invalid}>
        <span
          className="grid h-[62px] w-14 flex-none place-items-center text-champagne/80 max-sm:h-[58px] max-sm:w-12"
          aria-hidden="true"
        >
          {icon}
        </span>
        <input
          id={id}
          className="glass-input"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  )
}

export function SearchPanel({
  userId,
  zoneId,
  onUserIdChange,
  onZoneIdChange,
  onSubmit,
  loading,
  formError,
  invalidField,
}: SearchPanelProps) {
  return (
    <GlassSurface
      energized={loading}
      aria-label="Form pencarian akun Mobile Legends"
      className="w-full"
      initial={{ opacity: 0, y: 44, scale: 0.95, filter: 'blur(14px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ type: 'spring', stiffness: 110, damping: 17, delay: 0.3 }}
    >
      <div className="p-5 sm:p-8">
        <div className="mb-6 flex items-center gap-3.5 sm:mb-7">
          <span
            className="grid size-11 flex-none place-items-center rounded-[14px] text-gold"
            style={{
              background: 'linear-gradient(145deg, rgba(255, 217, 120, 0.22), rgba(255, 217, 120, 0.04))',
              boxShadow: '0 0 0 1px rgba(255, 217, 120, 0.3), 0 1px 0 rgba(255, 245, 223, 0.25) inset',
            }}
          >
            <ScanSearch size={21} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow">Player Search</p>
            <h2 className="mt-1 text-[17px] font-semibold tracking-tight text-ivory">
              Masukkan detail akun
            </h2>
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate aria-busy={loading}>
          <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
            <GlassField
              id="user-id"
              label="User ID"
              index="01"
              icon={<Fingerprint size={20} strokeWidth={1.6} />}
              value={userId}
              placeholder="123456789"
              maxLength={12}
              onChange={onUserIdChange}
              disabled={loading}
              invalid={invalidField === 'userId'}
              describedBy={invalidField === 'userId' ? 'form-error' : undefined}
            />
            <GlassField
              id="zone-id"
              label="Zone ID"
              index="02"
              icon={<Globe2 size={20} strokeWidth={1.6} />}
              value={zoneId}
              placeholder="1234"
              maxLength={6}
              onChange={onZoneIdChange}
              disabled={loading}
              invalid={invalidField === 'zoneId'}
              describedBy={invalidField === 'zoneId' ? 'form-error' : undefined}
            />
          </div>

          <AnimatePresence initial={false}>
            {formError && (
              <motion.div
                id="form-error"
                role="alert"
                className="overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <motion.p
                  className="flex items-start gap-2.5 pt-4 text-[13px] leading-relaxed text-[#ff9fb2]"
                  initial={{ y: -6, filter: 'blur(4px)' }}
                  animate={{ y: 0, filter: 'blur(0px)' }}
                >
                  <TriangleAlert size={16} strokeWidth={1.8} className="mt-0.5 flex-none" aria-hidden="true" />
                  {formError}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="cta mt-6"
            disabled={loading}
            whileHover={loading ? undefined : { scale: 1.02, y: -2 }}
            whileTap={loading ? undefined : { scale: 0.96, y: 1 }}
            transition={spring}
          >
            <AnimatePresence mode="wait" initial={false}>
              {loading ? (
                <motion.span
                  key="loading"
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.22 }}
                >
                  <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="rgba(255,245,223,0.25)" strokeWidth="2.5" />
                    <path d="M21 12a9 9 0 0 0-9-9" stroke="#ffd978" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Memeriksa akun
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.22 }}
                >
                  Check Account
                  <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        <p className="mt-5 text-center text-[11.5px] tracking-wide text-ivory/40">
          Pastikan User ID dan Zone ID sudah benar.
        </p>
      </div>
    </GlassSurface>
  )
}
