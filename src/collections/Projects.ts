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
      localized: true, // ✅ already localized
    },

    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'projectCategories',
      hasMany: true,
      required: false,
      label: 'Categories',
      admin: {
        description: 'Used for filters in the projects listing.',
      },
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
      localized: true, // ✅ already localized
      admin: {
        rows: 2,
        description: 'Short line of text shown on the homepage cards.',
      },
    },

    // 1) Main image of project
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Main Project Image',
      required: true,
    },

    // 2) Location & Intro
    {
      name: 'section2',
      type: 'group',
      label: 'Section 2 – Location & Intro Text',
      admin: {
        description:
          'This section shows the main project title and descriptive text. The subtitle "Location" is added automatically.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Intro Title',
          required: true,
          localized: true, // ✅ so you can change title per language
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Intro Text',
          required: true,
          localized: true, // ✅ main paragraph translated
          admin: {
            rows: 4,
            description: 'Describe the project context, site, or overall concept.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Right Image',
          required: true,
          // image can stay shared between locales
        },
      ],
    },

    // 3) Gallery
    {
      name: 'section3',
      type: 'group',
      label: 'Section 3 – 3 Image Gallery',
      admin: {
        description:
          'Three images: two stacked on the left, one tall image on the right. This section is used as a visual gallery.',
      },
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

    // 4) Project Details
    {
      name: 'section4',
      type: 'group',
      label: 'Section 4 – Project Details',
      admin: {
        description:
          'Left side: optional text and key project details. Right side: one main image. The heading "Project Details" is added automatically.',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          label: 'Details Intro Text',
          required: false,
          localized: true, // ✅ this text usually needs translation
          admin: {
            rows: 4,
            description: 'Optional paragraph introducing the project details.',
          },
        },

        // These can be localized or not depending on your preference
        {
          name: 'programme',
          type: 'text',
          label: 'Program',
          localized: true, // ✅ add this

          required: false,
          // localized: true, // ← uncomment if you want different wording EN/FR
          admin: {
            description: 'Program or type of project (e.g. Housing, Offices, Mixed-use).',
          },
        },
        {
          name: 'maitreDouvrage',
          type: 'text',
          localized: true, // ✅ add this

          label: 'Client / Maître d’ouvrage',
          required: false,
          // localized: true, // usually name is same in all languages, so can stay shared
          admin: {
            description: 'Name of the client or contracting authority.',
          },
        },
        {
          name: 'surfacePlancher',
          type: 'text',
          localized: true, // ✅ add this

          label: 'Floor Area',
          required: false,
          // localized: true, // generally numeric; probably shared
          admin: {
            description: 'Total floor area (e.g. "12 500 m²").',
          },
        },
        {
          name: 'etat',
          type: 'text',
          label: 'Status',
          required: false,
          localized: true, // ✅ this one is likely different ("En cours" vs "In progress")
          admin: {
            description: 'Project status (e.g. "In progress", "Completed", "Competition").',
          },
        },

        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Right Image',
          required: true,
          admin: {
            description: 'Main image displayed on the right side of the Project Details section.',
          },
        },
      ],
    },

    {
      name: 'section6',
      type: 'group',
      label: 'Section 6 – Optional 3 Images',
      admin: {
        description:
          'Optional section below Section 4. Row 1: 2 images. Row 2: 1 full-width image.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Section 6',
          defaultValue: false,
        },

        // Row 1
        {
          name: 'imageLeft',
          type: 'upload',
          relationTo: 'media',
          label: 'Row 1 – Left Image',
          required: false,
          admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) },
          validate: (value: unknown, { siblingData }: { siblingData?: { enabled?: boolean } }) => {
            if (siblingData?.enabled && !value)
              return 'Row 1 Left Image is required when Section 6 is enabled.'
            return true
          },
        },
        {
          name: 'imageRight',
          type: 'upload',
          relationTo: 'media',
          label: 'Row 1 – Right Image',
          required: false,
          admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) },
          validate: (value: unknown, { siblingData }: { siblingData?: { enabled?: boolean } }) => {
            if (siblingData?.enabled && !value)
              return 'Row 1 Right Image is required when Section 6 is enabled.'
            return true
          },
        },

        // Row 2 (full width)
        {
          name: 'imageFull',
          type: 'upload',
          relationTo: 'media',
          label: 'Row 2 – Full Width Image',
          required: false,
          admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) },
          validate: (value: unknown, { siblingData }: { siblingData?: { enabled?: boolean } }) => {
            if (siblingData?.enabled && !value)
              return 'Full Width Image is required when Section 6 is enabled.'
            return true
          },
        },
      ],
    },

    // 5) Related Projects
    {
      name: 'section5',
      type: 'group',
      label: 'Section 5 – Related Projects Carousel',
      admin: {
        description:
          'Select at least 2 related projects to display in a bottom carousel. The heading "Explore Our Projects" is added automatically.',
      },
      fields: [
        {
          name: 'relatedProjects',
          type: 'relationship',
          relationTo: 'projects',
          hasMany: true,
          required: true,
          label: 'Related Projects',
          admin: {
            description: 'Choose projects to display in the related projects carousel.',
          },
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
