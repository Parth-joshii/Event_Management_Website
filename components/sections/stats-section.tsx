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

/** Renders animated luxury statistics with metallic gold theme. */
export function StatsSection(): React.ReactElement {
  return (
    <section className="relative overflow-hidden border-y border-[#D4AF37]/30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3a2b4a] via-[#241a2f] to-[#17101f] py-20 text-white shadow-2xl">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <Container className="relative z-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat, index) => (
            <Reveal delay={index * 0.05} key={stat.label}>
              <article className="group relative overflow-hidden rounded-xl border border-[#D4AF37]/30 bg-gradient-to-b from-white/10 to-white/5 p-7 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D4AF37] hover:shadow-[0_25px_60px_rgba(212,175,55,0.25)]">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7CE] via-[#D4AF37] to-[#AA7C11] drop-shadow-[0_4px_16px_rgba(212,175,55,0.35)]">
                  <AnimatedCounter suffix={stat.suffix} value={stat.value} />
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[#EBDCFB]/85 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

