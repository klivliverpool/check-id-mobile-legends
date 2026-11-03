'use client'

import { motion, type Variants } from 'framer-motion'
import { Fingerprint, Layers, MapPin, Search, ShieldCheck, UserRound } from 'lucide-react'
import { CopyButton } from './copy-button'
import { GlassSurface } from './glass-surface'

export type PlayerResult = {
  userId: string
  zoneId: string
  nickname: string | null
  country: string | null
}

const UNAVAILABLE = 'Tidak tersedia'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.18 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.96, filter: 'blur(12px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 170, damping: 17, mass: 0.9 },
  },
}

function DataTile({
  label,
  value,
  icon,
  size,
  copyable = false,
  className = '',
}: {
  label: string
  value: string
  icon: React.ReactNode
  size: 'xl' | 'lg' | 'md'
  copyable?: boolean
  className?: string
}) {
  const available = value !== UNAVAILABLE
  const valueClass =
    size === 'xl'
      ? 'display text-[2rem] leading-[1.08] sm:text-[2.6rem]'
      : size === 'lg'
        ? 'text-[1.4rem] font-medium tabular-nums tracking-[0.04em] sm:text-[1.65rem]'
        : 'text-[1.15rem] font-medium tracking-wide sm:text-[1.3rem]'

  return (
    <motion.div variants={item} className={`data-tile ${className}`}>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, transparent 20%, rgba(255, 217, 120, 0.24) 50%, transparent 80%)',
        }}
        initial={{ x: '-110%', opacity: 1 }}
        animate={{ x: '110%', opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="relative flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2.5 flex items-center gap-2 text-champagne/80">
            {icon}
            <span className="data-label !text-champagne/75">{label}</span>
          </div>
          <p
            className={`${valueClass} break-words ${available ? 'text-ivory' : 'text-ivory/40'}`}
            style={{ overflowWrap: 'anywhere' }}
          >
            {value}
          </p>
        </div>
        {copyable && available && <CopyButton value={value} label={label} />}
      </div>
    </motion.div>
  )
}

export function ResultCard({
  player,
  onReset,
}: {
  player: PlayerResult
  onReset: () => void
}) {
  return (
    <GlassSurface
      aria-label="Hasil pencarian akun"
      className="w-full"
      tilt={2}
      initial={{ opacity: 0, y: 40, scale: 0.94, filter: 'blur(14px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -18, scale: 0.97, filter: 'blur(8px)' }}
      transition={{ type: 'spring', stiffness: 130, damping: 17 }}
    >
      <div className="p-5 sm:p-8">
        <div className="mb-6 flex items-center gap-3.5 sm:mb-7">
          <motion.span
            className="grid size-11 flex-none place-items-center rounded-[14px] text-gold"
            style={{
              background: 'linear-gradient(145deg, rgba(255, 217, 120, 0.26), rgba(255, 217, 120, 0.05))',
              boxShadow: '0 0 0 1px rgba(255, 217, 120, 0.4), 0 0 26px rgba(255, 217, 120, 0.25)',
            }}
            initial={{ scale: 0.4, rotate: -40, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
          >
            <ShieldCheck size={22} strokeWidth={1.6} aria-hidden="true" />
          </motion.span>
          <div className="min-w-0 flex-1">
            <p className="eyebrow">Identity Verified</p>
            <h2 className="display mt-1 text-[1.65rem] leading-none text-ivory">Akun ditemukan</h2>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-2 gap-3 sm:gap-3.5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <DataTile
            className="col-span-2"
            label="Username"
            icon={<UserRound size={14} strokeWidth={1.8} />}
            value={player.nickname || UNAVAILABLE}
            size="xl"
            copyable
          />
          <DataTile
            className="max-[420px]:col-span-2"
            label="ID"
            icon={<Fingerprint size={14} strokeWidth={1.8} />}
            value={player.userId}
            size="lg"
            copyable
          />
          <DataTile
            className="max-[420px]:col-span-2"
            label="Zone ID"
            icon={<Layers size={14} strokeWidth={1.8} />}
            value={player.zoneId}
            size="lg"
            copyable
          />
          <DataTile
            className="col-span-2"
            label="Wilayah Akun"
            icon={<MapPin size={14} strokeWidth={1.8} />}
            value={player.country || UNAVAILABLE}
            size="md"
          />
        </motion.div>

        <motion.button
          type="button"
          className="ghost-btn mt-6 w-full"
          onClick={onReset}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.75 }}
        >
          <Search size={16} strokeWidth={1.8} aria-hidden="true" />
          Cari akun lain
        </motion.button>
      </div>
    </GlassSurface>
  )
}
