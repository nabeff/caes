'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { DividerLineBlock as DividerLineProps } from '@/payload-types'
import { cn } from '@/utilities/ui'

export const DividerLineBlock: React.FC<DividerLineProps> = () => {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="container py-8">
      <div className="h-[2px] w-full bg-black/5 overflow-hidden">
        <div
          className={cn(
            'divider-line-inner h-full bg-black',
            visible && 'divider-line-inner--animate',
          )}
        />
      </div>
    </section>
  )
}

export default DividerLineBlock
