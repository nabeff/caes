'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { TeamStatsBlock as TeamStatsBlockProps } from '@/payload-types'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

type CountUpNumberProps = {
  value: string | null
}

/**
 * Animates a numeric value from 0 to target when it comes into view.
 * Works with plain numbers ("220") or with suffixes ("56%", "25").
 */
const CountUpNumber: React.FC<CountUpNumberProps> = ({ value }) => {
  const targetValue = value || ''
  const spanRef = useRef<HTMLSpanElement | null>(null)

  // extract numeric part + suffix once
  const numericRaw = targetValue.replace(/[^0-9.,-]/g, '').replace(',', '.')
  const numericTarget = parseFloat(numericRaw)
  const suffix = targetValue.replace(/[\d.,-]/g, '')

  const [display, setDisplay] = useState<string>(() =>
    isNaN(numericTarget) ? targetValue : `0${suffix}`,
  )

  useEffect(() => {
    const el = spanRef.current
    if (!el || typeof window === 'undefined') return

    // if value is not numeric → no animation
    if (isNaN(numericTarget)) {
      setDisplay(targetValue)
      return
    }

    const duration = 3000 // ms
    let frameId: number | null = null

    const startAnimation = () => {
      const startTime = performance.now()

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        // simple ease-out
        const eased = 1 - Math.pow(1 - progress, 3)

        const current = Math.round(numericTarget * eased)
        setDisplay(`${current}${suffix}`)

        if (progress < 1) {
          frameId = requestAnimationFrame(tick)
        }
      }

      frameId = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(el)

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      observer.disconnect()
    }
  }, [numericTarget, suffix, targetValue])

  return <span ref={spanRef}>{display}</span>
}

export const TeamStatsBlock: React.FC<TeamStatsBlockProps> = ({ title, items }) => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container">
        <div className="flex flex-col gap-10 justify-between">
          {/* Title on the right */}
          <div className="flex justify-end">
            <SplitRevealText
              as="h2"
              variant="title"
              text={title}
              className="text-2xl md:text-3xl lg:text-6xl uppercase"
            />
          </div>

          {/* Cards */}
          <div className="w-full">
            <div className="flex justify-between items-stretch w-full gap-4">
              {items?.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-end justify-end text-end bg-[#f7f7f7] px-4 h-[300px] py-4 w-[25%] gap-2"
                >
                  <h4 className="text-3xl md:text-8xl">
                    <CountUpNumber value={item.value as string} />
                  </h4>
                  <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.18em]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamStatsBlock
