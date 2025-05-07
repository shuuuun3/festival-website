'use client'

import { useEffect, useRef } from 'react'
import styles from './RoundedScroller.module.css'

interface RoundedScrollerProps {
  children: React.ReactNode
}

export default function RoundedScroller({ children }: RoundedScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const barRef      = useRef<SVGSVGElement>(null)
  const trackRef    = useRef<SVGPathElement>(null)
  const thumbRef    = useRef<SVGPathElement>(null)
  const styleRef    = useRef<HTMLStyleElement>(null)

  useEffect(() => {
    const scroller = scrollerRef.current!
    const bar       = barRef.current!
    const track     = trackRef.current!
    const thumb     = thumbRef.current!
    const styleTag  = styleRef.current!

    // Configuration — tweak as you like
    const config = {
      radius:        32,
      stroke:        4,
      inset:         4,
      trail:         20,
      thumb:         70,
      finish:        5,
      scrollPadding: 60,
      color:         '#f85922',
      trackAlpha:    0.2,
      offsetCorner:  0,
    }

    let frames: [number, number][] = []

    function syncBar() {
      const H       = scroller.offsetHeight
      const R       = config.radius
      const sw      = config.stroke
      const inset   = config.inset + sw / 2
      const innerR  = Math.max(0, R - inset)
      const mid     = R
      const padTop  = inset
      const padLeft = R * 2 - padTop

      // 1) SVG viewport
      bar.setAttribute('viewBox', `0 0 ${R*2} ${H}`)

      // 2) Build path d="…"
      const d = [
        `M${mid - config.trail},${padTop}`,
        innerR
          ? `a${innerR},${innerR} 0 0 1 ${innerR} ${innerR}`
          : `L${padLeft},${padTop}`,
        `L${padLeft},${H - (inset + innerR)}`,
        innerR
          ? `a${innerR},${innerR} 0 0 1 ${-innerR} ${innerR}`
          : `L${mid - config.trail},${H - padTop}`,
        `L${mid - config.trail},${H - padTop}`,
      ].join(' ')
      track.setAttribute('d', d)
      thumb.setAttribute('d', d)

      // 3) Lengths
      const totalLen     = Math.ceil(track.getTotalLength())
      const cornerLength = Math.ceil(thumb.getTotalLength())
      scroller.style.setProperty('--track-length', `${totalLen}`)
      scroller.style.setProperty('--thumb-size',  `${config.thumb}`)
      scroller.style.setProperty('--stroke-width', `${sw}`)
      scroller.style.setProperty('--color',        config.color)
      scroller.style.setProperty('--track-alpha',  `${config.trackAlpha}`)

      // 4) Keyframe points
      const padPct = Math.floor(
        config.scrollPadding / (scroller.scrollHeight - H) * 100
      )
      frames = [
        [   0,  config.thumb - config.finish ],
        [ padPct, -cornerLength + config.offsetCorner ],
        [100 - padPct, -(totalLen - cornerLength - config.offsetCorner)],
        [ 100,  -(totalLen - config.finish) ],
      ]

      // 5) Inject @keyframes
      styleTag.textContent = `
        @keyframes scroll {
          ${frames.map(([pct, off]) => `${pct}% { stroke-dashoffset: ${off}; }`).join('\n')}
        }
      `
    }

    // Observe size changes
    const ro = new ResizeObserver(() => syncBar())
    ro.observe(scroller)
    syncBar()

    return () => ro.disconnect()
  }, [])

  return (
    <div className={styles.scroller} ref={scrollerRef} data-rounded-scroll="true">
      <svg className={styles.bar} ref={barRef}>
        <path className={styles.track} ref={trackRef} />
        <path className={styles.thumb} ref={thumbRef} />
      </svg>
      <div className={styles.content}>
        {children}
      </div>
      <style ref={styleRef} />
    </div>
  )
}