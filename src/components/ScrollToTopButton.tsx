// src/components/ScrollToTopButton.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

export const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        group fixed bottom-10 right-6 z-40 flex h-10 w-10 items-center justify-center
        border border-white/20 bg-black
        hover:bg-white hover:border-black
        hover:translate-y-[-8px] hover:scale-105
        shadow-lg backdrop-blur transition-all duration-300
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <Image
        src="/arrowupsvg.svg"
        alt=""
        width={18}
        height={18}
        className=" group-hover:invert transition duration-300"
      />
    </button>
  )
}

export default ScrollToTopButton
