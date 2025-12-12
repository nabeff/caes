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
  ],
}

export default ProjectsListing
