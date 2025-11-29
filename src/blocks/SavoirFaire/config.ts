import type { Block } from 'payload'

export const SavoirFaire: Block = {
  slug: 'savoirFaire',
  interfaceName: 'SavoirFaireBlock',
  labels: {
    singular: 'Savoir-faire',
    plural: 'Blocs Savoir-faire',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
      defaultValue: 'Un savoir-faire diversifié',
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Text',
      required: true,
      localized: true,
      admin: {
        rows: 6,
      },
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Main image (left)',
      required: true,
    },
    {
      name: 'teamImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Team image (bottom right)',
      required: false,
    },
  ],
}

export default SavoirFaire
