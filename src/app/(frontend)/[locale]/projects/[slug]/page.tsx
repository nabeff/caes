// // src/app/(frontend)/[locale]/projects/[slug]/page.tsx
// import { notFound } from 'next/navigation'
// import Link from 'next/link'
// import { getPayload, type TypedLocale } from 'payload'
// import config from '@/payload.config'
// import type { Project, Media as MediaType } from '@/payload-types'
// import { Media } from '@/components/Media'

// type Params = {
//   locale: string
//   slug: string
// }

// export default async function ProjectPage({ params }: { params: Params }) {
//   const { slug, locale } = params

//   const payload = await getPayload({ config })

//   const { docs } = await payload.find({
//     collection: 'projects',
//     where: { slug: { equals: slug } },
//     limit: 1,
//     depth: 2,
//     locale: locale as TypedLocale, // cast here, keep route typing simple
//   })

//   const project = docs[0] as Project | undefined
//   if (!project) notFound()

//   const heroImage = project.heroImage as MediaType
//   const section2 = project.section2 as NonNullable<Project['section2']>
//   const section3 = project.section3 as NonNullable<Project['section3']>
//   const section4 = project.section4 as NonNullable<Project['section4']>
//   const section5 = project.section5 as NonNullable<Project['section5']>
//   const related = (section5.relatedProjects || []) as Project[]

//   return (
//     <main className="pb-20">
//       {/* 1) Main project image */}
//       <section className="relative w-full aspect-[16/9] overflow-hidden">
//         {heroImage && <Media resource={heroImage} fill imgClassName="object-cover" />}
//       </section>

//       {/* 2) Title + left (subtitle + text) / right (image) */}
//       <section className="container py-16">
//         <div className="mb-8 max-w-3xl">
//           <h1 className="text-3xl md:text-4xl lg:text-5xl">{section2.title}</h1>
//         </div>

//         <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
//           <div className="flex w-full flex-col gap-4 lg:w-1/2">
//             <h2 className="text-lg md:text-xl uppercase tracking-wide">{section2.subtitle}</h2>
//             <p className="whitespace-pre-line text-sm leading-relaxed md:text-base">
//               {section2.text}
//             </p>
//           </div>

//           <div className="w-full lg:w-1/2">
//             <div className="relative w-full aspect-[4/3] overflow-hidden">
//               <Media resource={section2.image as MediaType} fill imgClassName="object-cover" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 3) 3-image gallery */}
//       <section className="container py-12">
//         <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
//           <div className="flex flex-col gap-6">
//             <div className="relative w-full aspect-[4/3] overflow-hidden">
//               <Media
//                 resource={section3.imageLeftTop as MediaType}
//                 fill
//                 imgClassName="object-cover"
//               />
//             </div>
//             <div className="relative w-full aspect-[4/3] overflow-hidden">
//               <Media
//                 resource={section3.imageLeftBottom as MediaType}
//                 fill
//                 imgClassName="object-cover"
//               />
//             </div>
//           </div>

//           <div className="relative w-full aspect-[3/4] overflow-hidden">
//             <Media resource={section3.imageRight as MediaType} fill imgClassName="object-cover" />
//           </div>
//         </div>
//       </section>

//       {/* 4) Subtitle + text left, image right */}
//       <section className="container py-16">
//         <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
//           <div className="flex w-full flex-col gap-4 lg:w-1/2">
//             <h2 className="text-lg md:text-xl uppercase tracking-wide">{section4.subtitle}</h2>
//             <p className="whitespace-pre-line text-sm leading-relaxed md:text-base">
//               {section4.text}
//             </p>
//           </div>

//           <div className="w-full lg:w-1/2">
//             <div className="relative w-full aspect-[4/3] overflow-hidden">
//               <Media resource={section4.image as MediaType} fill imgClassName="object-cover" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 5) Related projects “carousel” */}
//       {related.length > 0 && (
//         <section className="container py-16">
//           <h2 className="mb-8 text-2xl md:text-3xl lg:text-4xl">{section5.title}</h2>

//           <div className="flex gap-6 overflow-x-auto pb-4">
//             {related.map((relProj) => {
//               const relThumb = relProj.thumbnail as MediaType | undefined

//               return (
//                 <Link
//                   key={relProj.id}
//                   href={`/${locale}/projects/${relProj.slug}`}
//                   className="group flex min-w-[260px] max-w-xs flex-shrink-0 border border-border"
//                 >
//                   <div className="relative h-48 w-full overflow-hidden">
//                     {relThumb && (
//                       <Media
//                         resource={relThumb}
//                         fill
//                         imgClassName="object-cover grayscale transition duration-500 group-hover:grayscale-0"
//                       />
//                     )}

//                     <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

//                     <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
//                       <h3 className="text-sm text-white md:text-base">{relProj.title as any}</h3>
//                       <p className="mt-1 line-clamp-2 text-[11px] text-white/80">
//                         {relProj.tinyText as any}
//                       </p>
//                     </div>
//                   </div>
//                 </Link>
//               )
//             })}
//           </div>
//         </section>
//       )}
//     </main>
//   )
// }
