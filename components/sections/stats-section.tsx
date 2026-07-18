import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const stats = [
  {
    label: "Events Planned",
    suffix: "+",
    value: 500
  },
  {
    label: "Luxury Weddings",
    suffix: "+",
    value: 150
  },
  {
    label: "Corporate Events",
    suffix: "+",
    value: 50
  },
  {
    label: "Client Satisfaction",
    suffix: "%",
    value: 98
  },
  {
    label: "Years Creative Experience",
    suffix: "+",
    value: 10
  }
] as const;

/** Renders animated luxury statistics. */
export function StatsSection(): React.ReactElement {
  return (
    <section className="bg-[#2D2238] py-20 text-white">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat, index) => (
            <Reveal delay={index * 0.05} key={stat.label}>
              <article className="rounded-lg border border-white/12 bg-white/10 p-6 text-center shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur transition hover:border-[#D4AF37]/70">
                <p className="font-display text-4xl font-semibold text-[#D4AF37]">
                  <AnimatedCounter suffix={stat.suffix} value={stat.value} />
                </p>
                <p className="mt-3 text-sm font-medium text-white/72">{stat.label}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
