import type { Block } from 'payload'

export const ProjectsListing: Block = {
  slug: 'projectsListing',
  interfaceName: 'ProjectsListingBlock',
  labels: {
    singular: 'Projects Listing',
    plural: 'Projects Listings',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      localized: true,
    },
    {
      name: 'quotes',
      type: 'array',
      label: 'Interleaved texts',
      labels: {
        singular: 'Quote',
        plural: 'Quotes',
      },
      admin: {
        description:
          'These texts will be inserted after every 4 projects. Choose left or right alignment.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          label: 'Text',
          required: true,
          localized: true,
        },
        {
          name: 'align',
          type: 'select',
          label: 'Alignment',
          required: true,
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
        },
      ],
    },
  ],
}

export default ProjectsListing
