import type { Block } from 'payload'

export const TeamStats: Block = {
  slug: 'teamStats',
  interfaceName: 'TeamStatsBlock',
  labels: {
    singular: 'Team stats',
    plural: 'Team stats blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
      defaultValue: 'Nos équipes',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Stat cards',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Value (e.g. "220", "56%")',
          required: true,
          localized: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label (e.g. "COLLABORATEURS")',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}

export default TeamStats
