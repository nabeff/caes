// next.config.ts
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import redirects from './redirects.js'

const withNextIntl = createNextIntlPlugin()

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

const serverHostname = (() => {
  try {
    return new URL(SERVER_URL).hostname
  } catch {
    return 'localhost'
  }
})()

const knownHosts = new Set([
  'localhost',
  '127.0.0.1',
  'caesarchitecture.com',
  'www.caesarchitecture.com',
  'public.blob.vercel-storage.com',
])

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects,

  images: {
    remotePatterns: [
      // Local dev
      { protocol: 'http', hostname: 'localhost', port: '3000' },
      { protocol: 'http', hostname: '127.0.0.1', port: '3000' },

      // Custom domains (prod)
      { protocol: 'https', hostname: 'caesarchitecture.com' },
      { protocol: 'https', hostname: 'www.caesarchitecture.com' },

      // Vercel Blob (Payload storage)
      { protocol: 'https', hostname: 'public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },

      // Vercel preview/prod hostname (only if it’s not already covered)
      ...(serverHostname && !knownHosts.has(serverHostname)
        ? [
            {
              protocol: SERVER_URL.startsWith('https') ? 'https' : 'http',
              hostname: serverHostname,
            },
          ]
        : []),
    ],
  },

  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
}

export default withNextIntl(withPayload(nextConfig), {
  devBundleServerPackages: false,
})
