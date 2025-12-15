import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import redirects from './redirects.js'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // Primary domain
      {
        protocol: 'https',
        hostname: 'caesarchitecture.com',
      },
      {
        protocol: 'https',
        hostname: 'www.caesarchitecture.com',
      },

      // Vercel production URL (safe fallback)
      ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? [
            {
              protocol: 'https',
              hostname: process.env.VERCEL_PROJECT_PRODUCTION_URL,
            },
          ]
        : []),

      // Payload Vercel Blob storage (VERY IMPORTANT)
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },

  redirects,

  webpack: (config) => {
    // Payload + Next fix
    config.resolve.alias.canvas = false
    return config
  },
}

export default withNextIntl(withPayload(nextConfig), {
  devBundleServerPackages: false,
})
