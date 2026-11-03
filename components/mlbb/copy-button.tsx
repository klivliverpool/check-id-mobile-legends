'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Copy } from 'lucide-react'

async function writeToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = value
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(area)
      return ok
    } catch {
      return false
    }
  }
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function handleCopy() {
    if (!(await writeToClipboard(value))) return
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="relative flex-none">
      <motion.button
        type="button"
        className="copy-btn"
        data-copied={copied}
        onClick={handleCopy}
        aria-label={`Salin ${label}`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.88 }}
        transition={{ type: 'spring', stiffness: 520, damping: 22 }}
      >
        <AnimatePresence>
          {copied && (
            <motion.span
              key="pulse"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[14px]"
              style={{ boxShadow: '0 0 0 2px rgba(255, 217, 120, 0.8)' }}
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: 1.7, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.svg
              key="check"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 16 }}
            >
              <motion.path
                d="M5 12.5l4.5 4.5L19 7.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.32, delay: 0.05, ease: 'easeOut' }}
              />
            </motion.svg>
          ) : (
            <motion.span
              key="copy"
              className="grid place-items-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 20 }}
            >
              <Copy size={19} strokeWidth={1.8} aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {copied && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -top-9 right-0 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{
              color: '#1c0710',
              background: 'linear-gradient(135deg, #fff0c2, #e8c777)',
              boxShadow: '0 8px 20px -6px rgba(255, 217, 120, 0.6)',
            }}
            initial={{ opacity: 0, y: 8, scale: 0.85, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          >
            Tersalin
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only" role="status">
        {copied ? `${label} disalin` : ''}
      </span>
    </div>
  )
}
