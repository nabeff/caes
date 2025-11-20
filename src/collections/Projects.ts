import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'tinyText', 'updatedAt'],
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
      label: 'Project Title',
      required: true,
      localized: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Thumbnail Image',
      required: true,
    },
    {
      name: 'tinyText',
      type: 'textarea',
      label: 'Tiny Text',
      required: true,
      localized: true,
      admin: {
        rows: 2,
        description: 'Short line of text shown on the homepage cards.',
      },
    },

    // --------- SECTION FIELDS FOR TEMPLATE PAGE ---------

    // 1) Main image of project
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Main Project Image',
      required: true,
    },

    // 2) Title + left (subtitle + text) / right (image)
    {
      name: 'section2',
      type: 'group',
      label: 'Section 2 – Intro',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle',
          required: true,
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Text',
          required: true,
          admin: { rows: 4 },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Right Image',
          required: true,
        },
      ],
    },

    // 3) 3-image gallery (2 left stacked, 1 right)
    {
      name: 'section3',
      type: 'group',
      label: 'Section 3 – 3 Image Gallery',
      fields: [
        {
          name: 'imageLeftTop',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Left Top Image',
        },
        {
          name: 'imageLeftBottom',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Left Bottom Image',
        },
        {
          name: 'imageRight',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Right Image',
        },
      ],
    },

    // 4) Subtitle + text left, image right
    {
      name: 'section4',
      type: 'group',
      label: 'Section 4 – Text + Image',
      fields: [
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle',
          required: true,
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Text',
          required: true,
          admin: { rows: 4 },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Right Image',
          required: true,
        },
      ],
    },

    // 5) Title + carousel of chosen projects (min 2)
    {
      name: 'section5',
      type: 'group',
      label: 'Section 5 – Related Projects Carousel',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'relatedProjects',
          type: 'relationship',
          relationTo: 'projects',
          hasMany: true,
          required: true,
          validate: (value) => {
            if (!value || !Array.isArray(value) || value.length < 2) {
              return 'Please select at least 2 related projects.'
            }
            return true
          },
        },
      ],
    },

    slugField(),
  ],
  timestamps: true,
}

export default Projects
