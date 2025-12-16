// middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware({
  ...routing,
  localeDetection: false, // ✅ always use defaultLocale for "/"
})

export const config = {
  matcher: ['/', '/(en|fr)/:path*'],
}
