'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const Preloader: React.FC = () => {
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    const handleLoad = () => {
      // let the logo show for a moment, then start opening curtains
      setTimeout(() => {
        setIsDone(true)
      }, 700)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  return (
    <div
      className={`preloader ${isDone ? 'preloader--done' : ''}`}
      aria-hidden="true"
    >
      {/* left & right black "curtains" */}
      <div className="preloader__panel preloader__panel--left" />
      <div className="preloader__panel preloader__panel--right" />

      {/* centered logo */}
      <div className="preloader__logo-wrap">
        <Image
          src="/preloader.svg"
          alt="Logo"
          width={180}
          height={80}
          className="preloader__logo"
          priority
        />
      </div>
    </div>
  )
}

export default Preloader
