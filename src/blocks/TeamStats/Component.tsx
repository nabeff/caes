import React from 'react'
import type { TeamStatsBlock as TeamStatsBlockProps } from '@/payload-types'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

export const TeamStatsBlock: React.FC<TeamStatsBlockProps> = ({ title, items }) => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container">
        <div className="flex flex-col gap-10 justify-between">
          {/* LEFT: Title */}
          <div className="flex justify-end">
            <SplitRevealText
              as="h2"
              variant="title"
              text={title}
              className="text-2xl md:text-3xl lg:text-6xl uppercase"
            />
          </div>

          <div className="w-full">
            <div className="flex justify-between items-stretch w-full gap-4">
              {items?.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-end justify-end text-end bg-[#f7f7f7] px-4 h-[300px] py-4 w-[25%] gap-2"
                >
                  <h4 className="text-3xl md:text-8xl ">{item.value}</h4>
                  <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.18em]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamStatsBlock
