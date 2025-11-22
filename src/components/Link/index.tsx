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

// Build href, then prefix locale for internal links
function buildHref(props: CMSLinkType, locale: TypedLocale): string | null {
  const { type, reference, url } = props

  // External URLs → leave as-is
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    return url
  }

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

    const base = reference.relationTo !== 'pages' ? `/${reference.relationTo}/${slug}` : `/${slug}`

    href = base
  } else if (type === 'custom' && typeof url === 'string') {
    if (!url.trim()) return null
    href = url.startsWith('/') ? url : `/${url}`
  } else if (typeof url === 'string') {
    // fallback if type is null but url exists
    if (!url.trim()) return null
    href = url.startsWith('/') ? url : `/${url}`
  }

  if (!href) return null

  // Prefix locale for relative paths (internal)
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

  // Inline link (used in rich text)
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {content}
      </Link>
    )
  }

  // Button-style link
  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {content}
      </Link>
    </Button>
  )
}
