// src/blocks/ProjectsGrid/config.ts
import type { Block } from 'payload'

export const ProjectsGrid: Block = {
  slug: 'projectsGrid',
  interfaceName: 'ProjectsGridBlock',
  labels: {
    singular: 'Projects Grid',
    plural: 'Projects Grids',
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
      required: true,
      admin: { rows: 3 },
    },
    {
      name: 'seeMoreLabel',
      type: 'text',
      label: '“See more” label',
      required: true,
      localized: true,
      admin: {
        description: 'Button label at the bottom (e.g. “See more”, “Voir plus”).',
      },
    },
  ],
}

export default ProjectsGrid
