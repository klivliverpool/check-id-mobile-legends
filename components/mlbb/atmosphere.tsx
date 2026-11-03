const PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const seed = (n: number) => {
    const x = Math.sin((i + 1) * 12.9898 * n) * 43758.5453
    return x - Math.floor(x)
  }
  return {
    left: `${Math.round(seed(1) * 100)}%`,
    top: `${Math.round(45 + seed(2) * 55)}%`,
    size: 2 + Math.round(seed(3) * 3),
    duration: 16 + Math.round(seed(4) * 18),
    delay: -Math.round(seed(5) * 30),
    sway: Math.round((seed(6) - 0.5) * 80),
    opacity: 0.35 + seed(7) * 0.5,
    ruby: seed(8) > 0.62,
  }
})

export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <div className="streak streak-a" />
      <div className="streak streak-b" />
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`particle${p.ruby ? ' ruby' : ''}`}
          style={
            {
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--p-sway': `${p.sway}px`,
              '--p-opacity': p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
      <div className="grain" />
      <div className="vignette" />
    </div>
  )
}
