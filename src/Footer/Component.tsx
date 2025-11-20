// src/Footer/Component.tsx
import React from 'react'
import Link from 'next/link'
import type { TypedLocale } from 'payload'

import type { Footer as FooterGlobal, Media as MediaType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'

export async function Footer({ locale }: { locale: TypedLocale }) {
  const footerData = (await getCachedGlobal('footer', 1, locale)()) as FooterGlobal

  const logo = footerData?.logo as MediaType | null
  const columns = footerData?.columns ?? []
  const socialLinks = footerData?.socialLinks ?? []
  const bottomLinks = footerData?.bottomLinks ?? []
  const bottomText = footerData?.bottomText
  const poweredByLabel = footerData?.poweredByLabel
  const poweredBy = footerData?.poweredBy ?? []

  // Render bottom text with "CAES" forced bold + white
  const renderBottomText = () => {
    if (typeof bottomText !== 'string') return null

    const parts = bottomText.split(/(CAES)/)

    return (
      <p className="max-w-3xl">
        {parts.map((part, idx) =>
          part === 'CAES' ? (
            <span key={idx} className="font-semibold text-white">
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
    <footer className="mt-auto border-t border-white/10 bg-black text-white">
      <div className="container flex flex-col gap-10 py-12">
        {/* Top: logo + link columns */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Logo from CMS (fallback to Logo component if missing) */}
          <div>
            <Link href={`/${locale}`} className="inline-flex items-center">
              {logo ? (
                <Media resource={logo} imgClassName="h-auto w-auto object-contain" />
              ) : (
                <Logo />
              )}
            </Link>
          </div>

          {/* Columns (title + CMSLink links) */}
          <div className="flex flex-wrap gap-32">
            {columns.map((col, idx) => {
              const links = col.links ?? []

              return (
                <div key={col.id ?? idx}>
                  <h2 className="text-lg uppercase">{col.title}</h2>

                  <div className="mt-4 flex flex-col gap-2 text-sm">
                    {links.map((row, i) => {
                      if (!row.link) return null

                      return (
                        <CMSLink
                          key={row.id ?? i}
                          {...row.link}
                          className="block text-sm text-white/70 transition hover:text-white"
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Social icons: icon upload + link, NO label */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((item, idx) => {
              if (!item.icon || !item.link) return null

              const iconMedia = item.icon as MediaType
              const url = (item.link as any).url as string | undefined
              const newTab = (item.link as any).newTab as boolean | undefined

              if (!url) return null

              const target = newTab ? '_blank' : undefined
              const rel = newTab ? 'noreferrer' : undefined

              return (
                <Link key={item.id ?? idx} href={url} target={target} rel={rel}>
                  <Media resource={iconMedia} imgClassName="object-contain" />
                </Link>
              )
            })}
          </div>
        )}

        {/* Divider line */}
        <div className="h-px w-full bg-white/10" />

        {/* Bottom bar */}
        <div className="flex justify-between gap-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between md:text-sm">
          {/* Left: bottom text + powered by */}
          <div className="flex items-center gap-4">
            {renderBottomText()}

            {(poweredByLabel || poweredBy.length > 0) && (
              <div className="flex flex-wrap items-center gap-1">
                {poweredByLabel && <span>{poweredByLabel}</span>}

                {poweredBy.map((row, idx) => {
                  if (!row.link) return null

                  return (
                    <React.Fragment key={row.id ?? idx}>
                      {idx > 0 && <span>&amp;</span>}
                      <CMSLink {...row.link} className="text-white transition hover:underline" />
                    </React.Fragment>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right: bottom links (Privacy, Terms, etc.) */}
          <div className="flex flex-wrap gap-4">
            {bottomLinks.map((row, idx) => {
              if (!row.link) return null

              return (
                <CMSLink
                  key={row.id ?? idx}
                  {...row.link}
                  className="text-white/60 underline transition hover:text-white"
                />
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
