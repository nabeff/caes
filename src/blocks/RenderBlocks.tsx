import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { TypedLocale } from 'payload'
import { HeroCarouselBlock } from './HeroCarousel/Component'
import TwoColumnCTABlock from './TwoColumnCTA/Component'
import DividerLineBlock from './DividerLine/Component'
import ProjectsGridBlock from './ProjectsGrid/Component'
import StudioIntroBlock from './StudioIntro/Component'
import StoryBlock from './StoryBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
   heroCarousel: HeroCarouselBlock,
   twoColumnCTA: TwoColumnCTABlock,
   dividerLine: DividerLineBlock,
   projectsGrid: ProjectsGridBlock,
     studioIntro: StudioIntroBlock,
     storyBlock: StoryBlock,

}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  locale: TypedLocale
}> = (props) => {
  const { blocks, locale } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div  key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer locale={locale} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
