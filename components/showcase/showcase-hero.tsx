import { Breadcrumb, type BreadcrumbItem } from "@/components/showcase/breadcrumb";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/animations/reveal";

interface ShowcaseHeroProps {
  readonly breadcrumbs: readonly BreadcrumbItem[];
  readonly description: string;
  readonly eyebrow: string;
  readonly title: string;
}

/** Renders the dark luxury hero used across Phase 3 showcase pages. */
export function ShowcaseHero({
  breadcrumbs,
  description,
  eyebrow,
  title
}: ShowcaseHeroProps): React.ReactElement {
  return (
    <section className="relative isolate overflow-hidden bg-[#2D2238] pt-32 pb-20 text-white sm:pt-40 sm:pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(191,162,219,0.34),transparent_32%),radial-gradient(circle_at_78%_62%,rgba(212,175,55,0.2),transparent_28%)]" />
      <Container className="relative z-10">
        <Breadcrumb items={breadcrumbs} />
        <Reveal className="mt-12 max-w-4xl">
          <p className="text-sm font-semibold tracking-[0.24em] text-[#D4AF37] uppercase">
            {eyebrow}
          </p>
          <h1 className="font-display mt-5 text-5xl font-semibold tracking-normal text-balance sm:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/74 sm:text-lg">
            {description}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
