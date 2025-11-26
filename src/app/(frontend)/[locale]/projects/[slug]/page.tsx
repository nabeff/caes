// src/app/(frontend)/[locale]/projects/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload, type TypedLocale } from 'payload'
import config from '@/payload.config'
import type { Project, Media as MediaType } from '@/payload-types'

import { ProjectGalleryProvider, GalleryImage } from '@/components/gallery/ProjectGallery'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { SplitRevealText } from '@/components/animations/SplitRevealText'
import { Media } from '@/components/Media'

// ---------- PARAM TYPES (Use Promise<Params> because your project forces this) ----------
type Params = {
  locale: string
  slug: string
}

type ProjectPageProps = {
  params: Promise<Params>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, locale } = await params

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    locale: locale as TypedLocale,
  })

  const project = docs[0] as Project | undefined
  if (!project) notFound()

  const heroImage = project.heroImage as MediaType
  const section2 = project.section2 as NonNullable<Project['section2']>
  const section3 = project.section3 as NonNullable<Project['section3']>
  const section4 = project.section4 as NonNullable<Project['section4']>
  const section5 = project.section5 as NonNullable<Project['section5']>
  const related = (section5.relatedProjects || []) as Project[]

  // --- Build gallery images + remember indices for each spot ---
  const galleryImages: MediaType[] = []
  const registerImage = (image?: MediaType | null) => {
    if (!image) return null
    const index = galleryImages.length
    galleryImages.push(image)
    return index
  }

  const heroIndex = registerImage(heroImage)
  const section2Image = section2.image as MediaType | undefined
  const section2Index = registerImage(section2Image)
  const imageLeftTop = section3.imageLeftTop as MediaType | undefined
  const imageLeftTopIndex = registerImage(imageLeftTop)
  const imageLeftBottom = section3.imageLeftBottom as MediaType | undefined
  const imageLeftBottomIndex = registerImage(imageLeftBottom)
  const imageRight = section3.imageRight as MediaType | undefined
  const imageRightIndex = registerImage(imageRight)
  const section4Image = section4.image as MediaType | undefined
  const section4Index = registerImage(section4Image)

  return (
    <main className="pb-20">
      <ProjectGalleryProvider images={galleryImages}>
        {/* 1) Main project image */}
        <section className="relative h-[700px] w-full overflow-hidden">
          {heroImage && heroIndex !== null && (
            <GalleryImage
              index={heroIndex}
              media={heroImage}
              wrapperClassName="relative h-full w-full"
            />
          )}
        </section>

        {/* 2) Title + left (subtitle + text) / right (image) */}
        <section className="container flex flex-col items-center gap-8 py-16">
          <div className="mb-8">
            <SplitRevealText
              as="h1"
              variant="title"
              className="text-3xl md:text-4xl lg:text-4xl"
              text={section2.title}
            />
          </div>

          <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex w-full flex-col gap-4 lg:w-1/2">
              <SplitRevealText
                as="h2"
                variant="text"
                className="text-lg md:text-xl uppercase tracking-wide"
                text={section2.subtitle}
              />

              <div className="mt-2 border-t border-neutral-200 pt-6">
                <p className="whitespace-pre-line text-sm leading-relaxed md:text-base w-[80%]">
                  {section2.text}
                </p>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative w-full overflow-hidden aspect-[4/3]">
                {section2Image && section2Index !== null && (
                  <GalleryImage
                    index={section2Index}
                    media={section2Image}
                    wrapperClassName="relative w-full h-full"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3) 3-image gallery */}
        <section className="container py-12">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-6 md:w-1/2">
              <div className="relative w-full overflow-hidden aspect-[4/3]">
                {imageLeftTop && imageLeftTopIndex !== null && (
                  <GalleryImage
                    index={imageLeftTopIndex}
                    media={imageLeftTop}
                    wrapperClassName="relative w-full h-full"
                  />
                )}
              </div>

              <div className="relative w-full overflow-hidden aspect-[4/3]">
                {imageLeftBottom && imageLeftBottomIndex !== null && (
                  <GalleryImage
                    index={imageLeftBottomIndex}
                    media={imageLeftBottom}
                    wrapperClassName="relative w-full h-full"
                  />
                )}
              </div>
            </div>

            <div className="relative w-full overflow-hidden aspect-[3/4] md:w-1/2">
              {imageRight && imageRightIndex !== null && (
                <GalleryImage
                  index={imageRightIndex}
                  media={imageRight}
                  wrapperClassName="relative w-full h-full"
                />
              )}
            </div>
          </div>
        </section>

        {/* 4) Subtitle + text left, image right */}
        {/* 4) Subtitle + details left, image right */}
        <section className="container py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex w-full flex-col gap-6 lg:w-1/2">
              {/* Subtitle */}
              <SplitRevealText
                as="h2"
                variant="text"
                className="text-lg md:text-xl uppercase tracking-wide"
                text={section4.subtitle}
              />

              {/* 🔹 Project details: PROGRAMME, MAÎTRE D’OUVRAGE, SURFACE PLANCHER, État */}
              <div className="mt-2 border-t border-neutral-200 pt-6">
                <div className=" gap-6 text-xs uppercase flex flex-col  ">
                  {section4.programme && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-neutral-500">PROGRAMME</span>
                      <span className="text-sm normal-case tracking-normal text-neutral-900">
                        {section4.programme}
                      </span>
                    </div>
                  )}

                  {section4.maitreDouvrage && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-neutral-500">MAÎTRE D’OUVRAGE</span>
                      <span className="text-sm normal-case tracking-normal text-neutral-900">
                        {section4.maitreDouvrage}
                      </span>
                    </div>
                  )}

                  {section4.surfacePlancher && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-neutral-500">SURFACE PLANCHER</span>
                      <span className="text-sm normal-case tracking-normal text-neutral-900">
                        {section4.surfacePlancher}
                      </span>
                    </div>
                  )}

                  {section4.etat && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-neutral-500">ÉTAT</span>
                      <span className="text-sm normal-case tracking-normal text-neutral-900">
                        {section4.etat}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right image unchanged */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-full overflow-hidden aspect-[4/3]">
                {section4Image && section4Index !== null && (
                  <GalleryImage
                    index={section4Index}
                    media={section4Image}
                    wrapperClassName="relative w-full h-full"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 5) Related projects “carousel” (unchanged structurally) */}
        {related.length > 0 && (
          <section className="container mx-auto py-16">
            {/* Heading in container */}
            <div className="mb-8">
              <SplitRevealText
                as="h2"
                variant="title"
                className="text-2xl md:text-3xl lg:text-4xl"
                text={section5.title}
              />
            </div>

            {/* Full-width carousel */}
            <Carousel
              opts={{
                align: 'start',
                loop: related.length > 3,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {related.map((relProj) => {
                  const relThumb = relProj.thumbnail as MediaType | undefined

                  return (
                    <CarouselItem
                      key={relProj.id}
                      className="pl-4 basis-full sm:basis-1/2 xl:basis-1/3"
                    >
                      <Link
                        href={`/${locale}/projects/${relProj.slug}`}
                        className="group flex h-full flex-col border border-border"
                      >
                        <div className="relative h-[300px] w-full overflow-hidden">
                          {relThumb && (
                            <Media
                              resource={relThumb}
                              fill
                              imgClassName="object-cover grayscale transition duration-500 group-hover:grayscale-0"
                            />
                          )}

                          {/* gradient overlay */}
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                          {/* text on hover */}
                          <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            <SplitRevealText
                              as="h3"
                              variant="text"
                              className="text-sm text-white md:text-base"
                              text={relProj.title as any}
                            />
                            <p className="mt-1 line-clamp-2 text-[11px] text-white/80">
                              {relProj.tinyText as any}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>

              {/* Arrows: bottom-right, square, black (md+ only) */}
              <CarouselPrevious
                className="
                  hidden md:inline-flex
                  left-auto top-auto translate-y-0
                  -bottom-[50px] right-14
                  rounded-none
                  bg-black text-white border-black
                  hover:bg-white hover:text-black hover:border-black
                "
              />
              <CarouselNext
                className="
                  hidden md:inline-flex
                  left-auto top-auto translate-y-0
                  -bottom-[50px] right-4
                  rounded-none
                  bg-black text-white border-black
                  hover:bg-white hover:text-black hover:border-black
                "
              />
            </Carousel>
          </section>
        )}
      </ProjectGalleryProvider>
    </main>
  )
}
