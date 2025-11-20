'use client'

import React, { useEffect } from 'react'
import type { TwoColumnCTABlock as TwoColumnCTAProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'

function lexicalToPlainText(node: any): string {
  if (!node) return ''
  const root = (node as any).root ?? node
  let out = ''

  const visit = (n: any): void => {
    if (!n) return
    if (Array.isArray(n)) {
      n.forEach(visit)
      return
    }
    if (n.type === 'text' && typeof n.text === 'string') {
      out += n.text
    }
    if (n.children) visit(n.children)
    if (n.type === 'paragraph') out += '\n'
  }

  visit(root.children ?? [])
  return out.trim()
}

export const TwoColumnCTABlock: React.FC<TwoColumnCTAProps> = ({ title, button, paragraph }) => {
  const paraText = paragraph && typeof paragraph === 'object' ? lexicalToPlainText(paragraph) : ''

  useEffect(() => {
    const container = document.getElementById('twoColumnCtaParagraph')
    if (!container) return

    const heading = container.querySelector('h3')
    if (!heading) return

    const text = heading.textContent ?? ''
    const words = text.split(' ')

    heading.innerHTML = words.map((w) => `<span style="opacity:0">${w}</span>`).join(' ')

    const spans = container.querySelectorAll('span')

    const revealSpans = () => {
      spans.forEach((span) => {
        const el = span as HTMLElement
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight) {
          const { left } = rect
          let top = rect.top
          top = top - window.innerHeight * 0.7

          let opacityValue =
            1 - (top * 0.01 + left * 0.001) < 0.1 ? 0.1 : 1 - (top * 0.01 + left * 0.001)

          opacityValue = Math.min(1, Math.max(0.1, +opacityValue.toFixed(3)))
          el.style.opacity = String(opacityValue)
        }
      })
    }

    window.addEventListener('scroll', revealSpans)
    revealSpans()
    return () => window.removeEventListener('scroll', revealSpans)
  }, [paraText])

  const cta = button as any

  return (
    <section className="container relative py-16">
      <div className="flex flex-col items-stretch justify-between gap-10 h-full lg:flex-row">
        <div className="flex w-full flex-row items-start justify-between h-auto lg:w-[22%] lg:flex-col">
          <h2 className="text-2xl md:text-xl lg:text-2xl">{title}</h2>
          <CMSLink {...cta} appearance="black" size="lg" className="mt-4" />
        </div>

        <div
          id="twoColumnCtaParagraph"
          className="flex w-full flex-col items-start gap-4 lg:w-[65%]"
        >
          <h3 className="text-base md:text-xl !leading-[2.2rem] lg:!leading-[2.2rem]">
            {paraText}
          </h3>
        </div>
      </div>
    </section>
  )
}

export default TwoColumnCTABlock
