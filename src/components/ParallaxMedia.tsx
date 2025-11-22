'use client'

import React, { useEffect, useRef, type ComponentProps, type FC } from 'react'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui' // if you don’t use this, just remove and inline classNames

type ParallaxMediaProps = ComponentProps<typeof Media> & {
  /**
   * Max travel in px, same idea as `data-shift` in your JS.
   * Default: 40
   */
  shift?: number

  /**
   * Extra classes for the outer wrapper (the "parallax-parent").
   */
  wrapperClassName?: string
}

/**
 * Parallax wrapper that mimics:
 *
 * progress = (center - vh/2) / vh    // -1..+1
 * y = -progress * shift
 *
 * It wraps your <Media> and uses transform: translateY(...) on an inner div.
 */
export const ParallaxMedia: FC<ParallaxMediaProps> = ({
  shift = 40,
  wrapperClassName,
  className,
  imgClassName,
  ...mediaProps
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const inner = innerRef.current
    if (!wrapper || !inner) return

    let ticking = false

    const update = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight || 1
      const rect = wrapper.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const progress = (center - vh / 2) / vh // ~ -1..+1
      const y = -progress * shift

      inner.style.transform = `translateY(${y}px)`
      ticking = false
    }

    const requestTick = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }

    // initial
    update()

    window.addEventListener('scroll', requestTick, { passive: true })
    window.addEventListener('resize', requestTick)

    return () => {
      window.removeEventListener('scroll', requestTick)
      window.removeEventListener('resize', requestTick)
    }
  }, [shift])

  return (
    <div
      ref={wrapperRef}
      className={cn('parallax-parent relative h-full w-full overflow-hidden', wrapperClassName)}
    >
      <div
        ref={innerRef}
        className={cn(
          // This mimics your .parallax-img: a bit taller for room to move
          'parallax-img h-[130%] w-full will-change-transform',
          className,
        )}
      >
        {/* Your original Media; keep fill/object-cover etc */}
        <Media {...mediaProps} imgClassName={cn('object-cover', imgClassName)} />
      </div>
    </div>
  )
}

export default ParallaxMedia
