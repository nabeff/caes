// src/Footer/config.ts
import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    // Logo upload (required)
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Footer logo',
      required: true,
    },

    // Columns: title + list of links
    {
      name: 'columns',
      type: 'array',
      label: 'Link columns',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Column title',
          required: true,
          localized: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          minRows: 1,
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },

    // Social icons: icon (upload) + link field
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social links',
      maxRows: 8,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon',
          required: true,
        },
        link({
          appearances: false,
        }),
      ],
      admin: {
        initCollapsed: true,
      },
    },

    // Bottom text (plain text, localized)
    {
      name: 'bottomText',
      type: 'text',
      label: 'Bottom text',
      localized: true,
    },

    // "Powered by" label (localized), e.g. "Powered by"
    {
      name: 'poweredByLabel',
      type: 'text',
      label: 'Powered by label',
      localized: true,
      admin: {
        description:
          'Example: "Powered by" (you can localize this per language).',
      },
    },

    // "Powered by" links, e.g. Forge, Digitamine
    {
      name: 'poweredBy',
      type: 'array',
      label: 'Powered by links',
      fields: [
        link({
          appearances: false,
        }),
      ],
      admin: {
        initCollapsed: true,
      },
    },

    // Bottom right links (Privacy, Terms, etc.)
    {
      name: 'bottomLinks',
      type: 'array',
      label: 'Bottom links',
      fields: [
        link({
          appearances: false,
        }),
      ],
      admin: {
        initCollapsed: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}

export default Footer
