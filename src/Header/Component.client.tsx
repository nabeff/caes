'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState, useTransition } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { TypedLocale } from 'payload'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import localization from '@/i18n/localization'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="container relative z-20   " {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-8 flex justify-between">
        <Link href="/">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>
        <LocaleSwitcher />
        <HeaderNav data={data} />
      </div>
    </header>
  )
}

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const supportedLocales = localization.locales.map((l) => l.code)

  function onSelectChange(value: TypedLocale) {
    startTransition(() => {
      // Get the current path without the locale prefix
      const currentPath = pathname.replace(new RegExp(`^/${locale}`), '')
      // Use router.replace with the new locale
      router.replace(`/${value}${currentPath}`)
    })
  }

  return (
    <div className="md:absolute right-36 top-8">
      <Select onValueChange={onSelectChange} value={locale}>
        <SelectTrigger className="w-auto text-sm bg-transparent gap-2 pl-0 md:pl-3 border-none">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {localization.locales
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((locale) => (
              <SelectItem
                value={locale.code}
                key={locale.code}
                className="flex flex-row gap-3 items-center text-xs"
              >
                <div className="flex flex-row gap-3 items-center text-xs">
                  <Image
                    src={`/images/icons/${locale.code}.png`}
                    width={24}
                    height={20}
                    alt={locale.label}
                  />

                  {locale.label}
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  )
}
