// src/blocks/DualMapBlock/config.ts
import type { Block } from 'payload'

export const DualMapBlock: Block = {
  slug: 'dualMapBlock',
  interfaceName: 'DualMapBlock',
  labels: {
    singular: 'Bloc cartes (x2)',
    plural: 'Blocs cartes (x2)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      required: true,
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Texte d’introduction',
    },

    {
      name: 'mapLeft',
      type: 'group',
      label: 'Carte gauche',
      fields: [
        {
          name: 'mapTitle',
          type: 'text',
          label: 'Titre de la carte',
          required: true,
        },
        {
          name: 'embedUrl',
          type: 'text',
          label: 'URL d’intégration Google Maps',
          required: true,
          admin: {
            description:
              'Collez ici l’URL d’intégration (iframe src) obtenue depuis Google Maps > Partager > Intégrer une carte.',
          },
        },
        {
          name: 'linkLabel',
          type: 'text',
          label: 'Texte du lien',
          required: true,
          defaultValue: 'Ouvrir dans Google Maps',
        },
        {
          name: 'linkUrl',
          type: 'text',
          label: 'URL du lien',
          required: false,
          admin: {
            description:
              'Optionnel. Si vide, on utilisera l’URL d’intégration comme lien.',
          },
        },
      ],
    },

    {
      name: 'mapRight',
      type: 'group',
      label: 'Carte droite',
      fields: [
        {
          name: 'mapTitle',
          type: 'text',
          label: 'Titre de la carte',
          required: true,
        },
        {
          name: 'embedUrl',
          type: 'text',
          label: 'URL d’intégration Google Maps',
          required: true,
        },
        {
          name: 'linkLabel',
          type: 'text',
          label: 'Texte du lien',
          required: true,
          defaultValue: 'Ouvrir dans Google Maps',
        },
        {
          name: 'linkUrl',
          type: 'text',
          label: 'URL du lien',
          required: false,
        },
      ],
    },
  ],
}
