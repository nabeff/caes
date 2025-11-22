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

  // 1) Reference links: build a localized custom URL from the referenced doc
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

  // 2) Custom links: just add /locale if missing
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

  // Reset header theme on route change
  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Sync local theme state
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

  const ctaRaw = data?.cta as any
  const logo = data?.logo as MediaType | undefined

  // Localize nav items
  const localizedNavItems =
    data?.navItems?.map((item) => ({
      ...item,
      link: localizeLink(item.link, locale),
    })) ?? []

  // Localize CTA
  const cta = localizeLink(ctaRaw, locale)

  const headerDataWithLocalizedNav: HeaderType = {
    ...data,
    navItems: localizedNavItems as HeaderType['navItems'],
  }

  return (
    <header className={headerClasses} {...(theme ? { 'data-theme': theme } : {})}>
      <div className="container flex items-center justify-between py-4 md:py-5">
        {/* Logo → localized root */}
        <Link href={`/${locale}`}>
          {logo ? (
            <div className="relative h-10 w-auto">
              <Media resource={logo} imgClassName="h-10 w-auto object-contain" htmlElement="div" />
            </div>
          ) : (
            <Logo loading="eager" priority="high" className="h-10 w-auto" />
          )}
        </Link>

        <div className="flex items-center gap-8">
          {/* Nav with localized links */}
          <HeaderNav data={headerDataWithLocalizedNav} />

          <LocaleToggle />

          {cta?.url && <CMSLink {...cta} appearance="blackMask" />}
        </div>
      </div>
    </header>
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
            onClick={() => changeLocale(code)}
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
