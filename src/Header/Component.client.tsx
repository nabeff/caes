'use client'

import React, { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import type { TypedLocale } from 'payload'

import type { Header as HeaderType, Media as MediaType } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'

interface HeaderClientProps {
  data: HeaderType
  locale: TypedLocale
}

// Prefix links with /locale and also handle reference links → custom URLs
function localizeLink(link: any, locale: TypedLocale): any {
  if (!link) return link

  if (
    link.type === 'reference' &&
    link.reference &&
    typeof link.reference === 'object' &&
    link.reference.value &&
    typeof link.reference.value === 'object'
  ) {
    const relationTo = link.reference.relationTo
    const slug = (link.reference.value as any).slug as string | undefined

    if (slug) {
      const collectionBase = relationTo === 'pages' ? '' : `/${relationTo}`
      return {
        ...link,
        type: 'custom',
        url: `/${locale}${collectionBase}/${slug}`,
      }
    }
  }

  if (link.type === 'custom' && typeof link.url === 'string') {
    const url = link.url.trim()
    if (!url) return link
    if (url.startsWith(`/${locale}`)) return link

    const normalized = url.startsWith('/') ? url : `/${url}`

    return {
      ...link,
      url: `/${locale}${normalized}`,
    }
  }

  return link
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, locale }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const [isVisible, setIsVisible] = useState(true)
  const [isAtTop, setIsAtTop] = useState(true)
  const lastScrollY = useRef(0)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Reset header theme + close menu on route change
  useEffect(() => {
    setHeaderTheme(null)
    setIsMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Sync theme
  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Hide / show on scroll
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
        if (delta > 5) setIsVisible(false)
        else if (delta < -5) setIsVisible(true)
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

  const ctaRaw = data?.cta as any
  const logo = data?.logo as MediaType | undefined

  const localizedNavItems =
    data?.navItems?.map((item) => ({
      ...item,
      link: localizeLink(item.link, locale),
    })) ?? []

  const cta = localizeLink(ctaRaw, locale)

  const headerDataWithLocalizedNav: HeaderType = {
    ...data,
    navItems: localizedNavItems as HeaderType['navItems'],
  }

  const navItems = headerDataWithLocalizedNav.navItems ?? []

  return (
    <>
      <header className={headerClasses} {...(theme ? { 'data-theme': theme } : {})}>
        <div className="container flex items-center justify-between py-4 md:py-5">
          {/* Logo → localized root */}
          <Link href={`/${locale}`}>
            {logo ? (
              <div className="relative h-10 w-auto">
                <Media
                  resource={logo}
                  imgClassName="h-10 w-auto object-contain"
                  htmlElement="div"
                />
              </div>
            ) : (
              <Logo loading="eager" priority="high" className="h-10 w-auto" />
            )}
          </Link>

          <div className="flex items-center gap-4">
            {/* Desktop */}
            <div className="hidden items-center gap-8 md:flex">
              <HeaderNav data={headerDataWithLocalizedNav} />
              <LocaleToggle />
              {cta?.url && <CMSLink {...cta} appearance="blackMask" />}
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-3 md:hidden">
              <LocaleToggle />
              {cta?.url && (
                <CMSLink {...cta} appearance="blackMask" size="sm" className="px-4 py-2 text-xs" />
              )}

              {/* Burger: two lines → merge into one when open */}
              <button
                type="button"
                aria-label="Toggle menu"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex h-8 w-10 items-center justify-center"
              >
                <span className="relative flex  w-5 flex-col justify-between">
                  <span
                    className={cn(
                      'block h-[2px] w-full bg-black transition-transform duration-300',
                      isMenuOpen ? 'translate-y-[3px]' : '-translate-y-[3px]',
                    )}
                  />
                  <span
                    className={cn(
                      'block h-[2px] w-full bg-black transition-transform duration-300',
                      isMenuOpen ? '-translate-y-[3px]' : 'translate-y-[3px]',
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={cn(
          'fixed inset-0 z-20 bg-black text-white transition-transform duration-300 md:hidden',
          isMenuOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none',
        )}
      >
        <div className="flex h-full flex-col justify-center px-6 pb-10 pt-24">
          <nav className="flex flex-col gap-4">
            {navItems.map((item, index) => {
              if (!item.link) return null

              return (
                <div
                  key={item.id ?? index}
                  className={cn(
                    'transform opacity-0 transition-all duration-300',
                    isMenuOpen && 'translate-y-0 opacity-100',
                  )}
                  style={{ transitionDelay: `${index * 90 + 80}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CMSLink {...item.link} appearance="link" className="text-xl tracking-wide" />
                </div>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

// Locale switcher – keeps the same path, swaps only the /locale prefix
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

  const langs: TypedLocale[] = ['en', 'fr']

  return (
    <div className="flex items-center py-1 text-[13px] uppercase tracking-wide">
      {langs.map((code) => {
        const isActive = code === locale

        return (
          <button
            key={code}
            type="button"
            onClick={() => changeLocale(code as TypedLocale)}
            className={cn(
              'px-1 py-0.5 transition-colors uppercase',
              isActive ? 'text-black underline' : 'text-black/30 hover:underline',
            )}
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}

export default HeaderClient
