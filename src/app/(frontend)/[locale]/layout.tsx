import type { Metadata } from 'next'
import React from 'react'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { TypedLocale } from 'payload'
import { notFound } from 'next/navigation'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import localization from '@/i18n/localization'
import { routing } from '@/i18n/routing'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import Preloader from '@/components/Preloader'

/* ============================
   METADATA (HEAD HANDLED HERE)
============================= */

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
}

/* ============================
   ROOT LAYOUT
============================= */

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: TypedLocale }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const { isEnabled } = await draftMode()
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={cn(GeistSans.variable, GeistMono.variable)}
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden">
        {/* Theme must be inside body */}
        <InitTheme />

        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Preloader />
            <Header locale={locale} />
            {children}
            <Footer locale={locale} />
            <ScrollToTopButton />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
