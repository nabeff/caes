import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import localization from './localization'

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)

export type Locale = (typeof routing.locales)[number]
