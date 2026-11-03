'use client'

import { motion } from 'framer-motion'
import { RotateCcw, ShieldAlert } from 'lucide-react'
import { GlassSurface } from './glass-surface'

export function ErrorCard({
  message,
  code,
  onRetry,
}: {
  message: string
  code?: string
  onRetry: () => void
}) {
  return (
    <GlassSurface
      role="alert"
      tilt={0}
      className="w-full"
      initial={{ opacity: 0, y: 30, scale: 0.96, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -14, scale: 0.97, filter: 'blur(6px)' }}
      transition={{ type: 'spring', stiffness: 140, damping: 19 }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ boxShadow: '0 0 0 1px rgba(255, 23, 79, 0.7), 0 0 60px rgba(255, 23, 79, 0.35)' }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <span className="relative grid size-12 flex-none place-items-center rounded-2xl text-ruby"
            style={{
              background: 'linear-gradient(145deg, rgba(255, 23, 79, 0.24), rgba(255, 23, 79, 0.05))',
              boxShadow: '0 0 0 1px rgba(255, 23, 79, 0.45)',
            }}
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: '0 0 0 2px rgba(255, 23, 79, 0.55)' }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut', repeat: 1, repeatDelay: 0.2 }}
            />
            <ShieldAlert size={22} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow !text-ruby/90">Pencarian belum berhasil</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ivory/85">{message}</p>
            {code && (
              <span className="mt-3 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory/55"
                style={{ boxShadow: '0 0 0 1px rgba(255, 245, 223, 0.14)' }}
              >
                {code}
              </span>
            )}
          </div>
        </div>
        <motion.button
          type="button"
          className="ghost-btn flex-none"
          onClick={onRetry}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          <RotateCcw size={15} strokeWidth={1.8} aria-hidden="true" />
          Coba lagi
        </motion.button>
      </div>
    </GlassSurface>
  )
}
