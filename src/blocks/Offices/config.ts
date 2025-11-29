import type { Block } from 'payload'

export const Offices: Block = {
  slug: 'offices',
  interfaceName: 'OfficesBlock',
  labels: {
    singular: 'Offices',
    plural: 'Offices Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
      defaultValue: 'Nos bureaux',
    },
    {
      name: 'rightText',
      type: 'text',
      label: 'Right header text (e.g. opening hours)',
      required: false,
      localized: true,
      defaultValue: '09 : 00 - 18 : 00',
    },
    {
      name: 'offices',
      type: 'array',
      label: 'Offices',
      minRows: 1,
      fields: [
        {
          name: 'city',
          type: 'text',
          label: 'City',
          required: true,
          localized: true,
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Address',
          required: true,
          localized: true,
          admin: {
            rows: 3,
          },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone number',
          required: false,
          localized: true,
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email',
          required: false,
          localized: true,
        },
        {
          name: 'mapLabel',
          type: 'text',
          label: 'Map link label',
          required: false,
          localized: true,
          defaultValue: 'Map',
        },
        {
          name: 'mapUrl',
          type: 'text',
          label: 'Map URL',
          required: false,
        },
      ],
    },
  ],
}

export default Offices
