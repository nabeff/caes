'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState, useTransition } from 'react'

import type { Header as HeaderType, Media as MediaType } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { TypedLocale } from 'payload'
import { useLocale } from 'next-intl'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'

interface HeaderClientProps {
  data: HeaderType
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const [isVisible, setIsVisible] = useState(true)
  const [isAtTop, setIsAtTop] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const currentY = window.scrollY || 0
      const delta = currentY - lastScrollY.current
      const atTop = currentY <= 0

      setIsAtTop(atTop)

      if (atTop) {
        setIsVisible(true)
      } else {
        if (delta > 5) {
          setIsVisible(false)
        } else if (delta < -5) {
          setIsVisible(true)
        }
      }

      lastScrollY.current = currentY
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const headerClasses = cn(
    'fixed top-0 left-0 right-0 z-30 border-b border-black transition-all duration-300',
    isVisible ? 'translate-y-0' : '-translate-y-full',
    isAtTop ? 'bg-white/70 backdrop-blur-sm' : 'bg-white',
  )

  const cta = data?.cta as any
  const logo = data?.logo as MediaType | undefined

  return (
    <header className={headerClasses} {...(theme ? { 'data-theme': theme } : {})}>
      <div className="container flex items-center justify-between py-4 md:py-5">
        <Link href="/">
          {logo ? (
            <div className="relative h-10 w-auto">
              <Media resource={logo} imgClassName="h-10 w-auto object-contain" htmlElement="div" />
            </div>
          ) : (
            <Logo loading="eager" priority="high" className="h-10 w-auto" />
          )}
        </Link>

        <div className="flex items-center gap-8">
          <HeaderNav data={data} />

          <LocaleToggle />

          {cta?.url && (
            <CMSLink {...cta} appearance="black" size="sm" className="hidden md:inline-flex" />
          )}
        </div>
      </div>
    </header>
  )
}

// FR / EN toggle stays as you wrote it
function LocaleToggle() {
  const locale = useLocale() as TypedLocale
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  function changeLocale(value: TypedLocale) {
    if (value === locale) return

    startTransition(() => {
      const currentPath = pathname.replace(new RegExp(`^/${locale}`), '')
      router.replace(`/${value}${currentPath}`)
    })
  }

  const langs: TypedLocale[] = ['en', 'fr'] as TypedLocale[]

  return (
    <div className="flex items-center  py-1 text-[13px] uppercase tracking-wide">
      {langs.map((code) => {
        const isActive = code === locale

        return (
          <button
            key={code}
            type="button"
            onClick={() => changeLocale(code)}
            className={cn(
              'px-1 py-0.5 transition-colors uppercase',
              isActive ? 'text-black underline' : 'text-black/30 hover:underline ',
            )}
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}
