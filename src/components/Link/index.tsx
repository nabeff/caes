'use client'

import React from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import type { TypedLocale } from 'payload'

import type { Page, Post } from '@/payload-types'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

function buildHref(props: CMSLinkType, locale: TypedLocale): string | null {
  const { type, reference, url } = props
  const raw = typeof url === 'string' ? url.trim() : ''

  // ---------- GLOBAL NORMALIZATION (mailto/tel + plain email/phone) ----------
  const isHttp = (v: string) => v.startsWith('http://') || v.startsWith('https://')
  const isMailto = (v: string) => v.toLowerCase().startsWith('mailto:')
  const isTel = (v: string) => v.toLowerCase().startsWith('tel:')
  const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const normalizePhone = (v: string) => v.replace(/[()\s.-]/g, '')
  const looksLikePhone = (v: string) => {
    if (!v) return false
    if (v.includes('@')) return false
    const p = normalizePhone(v)
    return /^[+]?[\d]{6,}$/.test(p)
  }

  // IMPORTANT: return early for external/schemes so we DON'T add "/" or locale
  if (raw) {
    if (isHttp(raw) || isMailto(raw) || isTel(raw)) return raw
    if (looksLikeEmail(raw)) return `mailto:${raw}`
    if (looksLikePhone(raw)) return `tel:${normalizePhone(raw)}`
  }
  // -------------------------------------------------------------------------

  let href: string | null = null

  if (type === 'reference' && reference?.value) {
    const value = reference.value as any
    const slug: string =
      typeof value === 'string' || typeof value === 'number'
        ? String(value)
        : typeof value?.slug === 'string'
          ? value.slug
          : ''

    if (!slug) return null

    href = reference.relationTo !== 'pages' ? `/${reference.relationTo}/${slug}` : `/${slug}`
  } else if (raw) {
    // internal custom URL fallback
    href = raw.startsWith('/') ? raw : `/${raw}`
  }

  if (!href) return null

  // Prefix locale ONLY for internal paths
  if (href.startsWith('/') && !href.startsWith(`/${locale}`)) {
    href = `/${locale}${href}`
  }

  return href
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const locale = useLocale() as TypedLocale

  const {
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    size: sizeFromProps,
    ...rest
  } = props

  const href = buildHref(
    {
      appearance,
      children,
      className,
      label,
      newTab,
      size: sizeFromProps,
      ...rest,
    },
    locale,
  )

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  const content = (
    <>
      {label && label}
      {children && children}
    </>
  )

  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {content}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {content}
      </Link>
    </Button>
  )
}
