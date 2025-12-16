// src/Footer/Component.tsx
import React from 'react'
import Link from 'next/link'
import type { TypedLocale } from 'payload'

import type { Footer as FooterGlobal, Media as MediaType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { getPayload } from 'payload'
import config from '@/payload.config'

function isEmailLabel(label?: string | null) {
  if (!label) return false
  const s = label.trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

function isPhoneLabel(label?: string | null) {
  if (!label) return false
  const s = label.trim()

  // Accept +, spaces, (), dashes; require at least 7 digits
  const digits = s.replace(/\D/g, '')
  if (digits.length < 7) return false

  return /^[+]?[\d\s().-]+$/.test(s)
}

function normalizePhoneForTel(label: string) {
  const trimmed = label.trim()
  const hasPlus = trimmed.startsWith('+')
  const digits = trimmed.replace(/\D/g, '')
  return hasPlus ? `+${digits}` : digits
}

/**
 * We do NOT want these to go through CMSLink normalization (which might treat them like normal links).
 * But we DO want them clickable as mailto/tel.
 */
function renderEmailOrPhone(label: string, className: string, key: React.Key) {
  const safeLabel = label.trim()

  if (isEmailLabel(safeLabel)) {
    return (
      <a key={key} href={`mailto:${safeLabel}`} className={className}>
        {label}
      </a>
    )
  }

  if (isPhoneLabel(safeLabel)) {
    const tel = normalizePhoneForTel(safeLabel)
    return (
      <a key={key} href={`tel:${tel}`} className={className}>
        {label}
      </a>
    )
  }

  // fallback (shouldn't happen if caller checks)
  return (
    <span key={key} className={className}>
      {label}
    </span>
  )
}

function shouldOverrideCMSLink(link: any) {
  const label = typeof link?.label === 'string' ? link.label : null
  return isEmailLabel(label) || isPhoneLabel(label)
}

export async function Footer({ locale }: { locale: TypedLocale }) {
  const payload = await getPayload({ config })
  const footerData = (await payload.findGlobal({
    slug: 'footer',
    depth: 1,
    locale,
  })) as FooterGlobal

  const logo = footerData?.logo as MediaType | null
  const columns = footerData?.columns ?? []
  const socialLinks = footerData?.socialLinks ?? []
  const bottomLinks = footerData?.bottomLinks ?? []
  const bottomText = footerData?.bottomText
  const poweredByLabel = footerData?.poweredByLabel
  const poweredBy = footerData?.poweredBy ?? []

  const renderBottomText = () => {
    if (typeof bottomText !== 'string') return null

    const parts = bottomText.split(/(CAES)/)

    return (
      <p className="max-w-3xl">
        {parts.map((part, idx) =>
          part === 'CAES' ? (
            <span key={idx} className="font-semibold text-black">
              CAES
            </span>
          ) : (
            <span key={idx}>{part}</span>
          ),
        )}
      </p>
    )
  }

  return (
    <footer className=" border-t border-black/20 text-black pt-10">
      <div className="container flex flex-col gap-10 py-12">
        {/* Top: logo + link columns */}
        <div className="flex flex-col gap-10 lg:flex-row items-center justify-center lg:items-start lg:justify-between">
          {/* Logo from CMS (fallback to Logo component if missing) */}
          <div>
            <Link href={`/${locale}`} className="inline-flex items-center">
              {logo ? (
                <Media resource={logo} imgClassName="h-[126px] w-[243px] object-contain" />
              ) : (
                <Logo />
              )}
            </Link>
          </div>

          {/* Columns (title + links) */}
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-start gap-8 md:gap-20">
            {columns.map((col, idx) => {
              const links = col.links ?? []

              return (
                <div
                  key={col.id ?? idx}
                  className="flex flex-col text-center md:text-start items-center md:items-start gap-3"
                >
                  <h2 className="text-xl uppercase">{col.title}</h2>

                  <div className="flex flex-col gap-2 items-center md:items-start text-sm">
                    {links.map((row, i) => {
                      if (!row.link) return null

                      const className =
                        'block w-fit text-base text-black/70 transition hover:text-black link-underline-swipe'

                      // ✅ If label is email or phone => clickable mailto/tel (not CMSLink / Next Link)
                      if (shouldOverrideCMSLink(row.link)) {
                        const label = (row.link as any).label as string
                        return renderEmailOrPhone(label, className, row.id ?? i)
                      }

                      return <CMSLink key={row.id ?? i} {...row.link} className={className} />
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Social icons: icon upload + link, NO label */}
        {socialLinks.length > 0 && (
          <div className="flex flex-row justify-center gap-4 md:justify-start">
            {socialLinks.map((item, idx) => {
              if (!item.icon || !item.link) return null

              const iconMedia = item.icon as MediaType
              const url = (item.link as any).url as string | undefined
              const newTab = (item.link as any).newTab as boolean | undefined

              if (!url) return null

              const target = newTab ? '_blank' : undefined
              const rel = newTab ? 'noreferrer' : undefined

              return (
                <Link
                  key={item.id ?? idx}
                  href={url}
                  target={target}
                  rel={rel}
                  className="inline-flex transition-transform duration-200 ease-out hover:scale-[1.05] hover:-translate-y-[2px]"
                >
                  <Media resource={iconMedia} imgClassName="object-contain h-[24px] w-[24px]" />
                </Link>
              )
            })}
          </div>
        )}

        {/* Divider line */}
        <div className="h-px w-full bg-black/20" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between gap-6 text-xs text-black/60 items-center md:justify-between md:text-xs">
          {/* Left: bottom text + powered by */}
          <div className="flex flex-col md:flex-row items-center gap-2">
            {renderBottomText()}

            {(poweredByLabel || poweredBy.length > 0) && (
              <div className="flex flex-wrap items-center gap-1">
                {poweredByLabel && <span>{poweredByLabel}</span>}

                {poweredBy.map((row, idx) => {
                  if (!row.link) return null

                  return (
                    <React.Fragment key={row.id ?? idx}>
                      {idx > 0 && <span>&amp;</span>}

                      {/* ✅ If label is email/phone => mailto/tel */}
                      {shouldOverrideCMSLink(row.link) ? (
                        renderEmailOrPhone(
                          (row.link as any).label as string,
                          'text-black transition link-underline-swipe',
                          row.id ?? idx,
                        )
                      ) : (
                        <CMSLink
                          {...row.link}
                          className="text-black transition link-underline-swipe"
                        />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            )}
          </div>

          {/* NOTE: bottomLinks exists in your data but wasn't rendered in your snippet.
              Keeping your original structure unchanged as requested. */}
          {bottomLinks.length > 0 ? null : null}
        </div>
      </div>
    </footer>
  )
}

export default Footer
