import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { processTimeline } from "@/features/timeline/data/process-timeline";

/** Renders the event planning process timeline. */
export function ProcessTimelineSection(): React.ReactElement {
  return (
    <section
      id="process"
      className="bg-[linear-gradient(180deg,#FAF7FF_0%,#EBDCFB_100%)] py-24 sm:py-28"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Our Approach"
            title="A Seamless Journey From Vision To Celebration"
            description="Our considered planning process brings clarity to every decision and beauty to every detail—from the first conversation to the final farewell."
          />
        </Reveal>
        <div className="relative mt-16">
          <div className="absolute top-0 left-6 hidden h-full w-px bg-[#BFA2DB]/60 md:block lg:left-1/2" />
          <div className="grid gap-8">
            {processTimeline.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;

              return (
                <Reveal delay={index * 0.05} key={item.step}>
                  <article className="relative grid gap-5 md:grid-cols-[4rem_1fr] lg:grid-cols-2 lg:gap-12">
                    <div className="relative z-10 flex md:justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      <span className="flex size-12 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-white text-sm font-bold text-[#2D2238] shadow-[0_16px_40px_rgba(45,34,56,0.16)]">
                        {item.step}
                      </span>
                    </div>
                    <div
                      className={
                        isEven ? "lg:col-start-1 lg:pr-12" : "lg:col-start-2 lg:pl-12"
                      }
                    >
                      <div className="rounded-lg border border-white/70 bg-white/82 p-6 shadow-[0_22px_70px_rgba(45,34,56,0.08)] backdrop-blur">
                        <div className="flex items-center gap-3">
                          <div className="flex size-11 items-center justify-center rounded-full bg-[#EBDCFB] text-[#7d5ea1]">
                            <Icon aria-hidden="true" className="size-5" />
                          </div>
                          <h3 className="text-xl font-semibold text-[#2D2238]">
                            {item.title}
                          </h3>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[#5c4b6e]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
