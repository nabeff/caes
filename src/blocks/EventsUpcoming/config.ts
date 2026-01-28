import type { Block } from 'payload'

export const EventsUpcoming: Block = {
  slug: 'eventsUpcoming',
  interfaceName: 'EventsUpcomingBlock',
  labels: {
    singular: 'Upcoming Events',
    plural: 'Upcoming Events',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { rows: 3 },
    },
    {
      name: 'seeMoreLabel',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
}

export default EventsUpcoming
