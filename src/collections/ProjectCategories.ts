import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const ProjectCategories: CollectionConfig = {
  slug: 'projectCategories',
  labels: {
    singular: 'Project category',
    plural: 'Project categories',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Category title',
      required: true,
      localized: true,
    },
    slugField({
      name: 'slug',
      localized: true,
    }),
  ],
  timestamps: true,
}

export default ProjectCategories
