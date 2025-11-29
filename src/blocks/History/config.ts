

import type { Block } from 'payload'

export const History: Block = {
  slug: 'history',
  interfaceName: 'HistoryBlock',
  labels: {
    singular: 'History',
    plural: 'History Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
      defaultValue: 'Notre histoire',
    },
    {
      name: 'leftText',
      type: 'textarea',
      label: 'Left column text (under building image)',
      required: true,
      localized: true,
      admin: {
        rows: 6,
      },
    },
    {
      name: 'rightText',
      type: 'textarea',
      label: 'Right column text (under title)',
      required: true,
      localized: true,
      admin: {
        rows: 6,
      },
    },
    {
      name: 'buildingImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Building image (left)',
      required: true,
    },
    {
      name: 'teamImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Team image (right bottom)',
      required: false,
    },
  ],
}

export default History

