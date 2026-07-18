import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { GradientButton } from "@/components/ui/gradient-button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { serviceOfferings } from "@/features/services/data/services";

/** Renders the core service offering cards. */
export function ServicesSection(): React.ReactElement {
  return (
    <section id="services" className="relative bg-[#FAF7FF] py-24 sm:py-28">
      <span id="packages" className="absolute -top-24 block size-px" />
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="Services We Offer"
            description="From intimate private celebrations to grand wedding productions, each service is designed with luxury aesthetics and operational discipline."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {serviceOfferings.map((service, index) => {
            const Icon = service.icon;

            return (
              <Reveal delay={index * 0.05} key={service.title}>
                <article className="group overflow-hidden rounded-lg border border-white/70 bg-white shadow-[0_24px_80px_rgba(45,34,56,0.09)] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/70">
                  <ResponsiveImage
                    alt={service.imageAlt}
                    className="h-64"
                    fallbackClassName={service.fallbackClassName}
                    imageClassName="transition duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    src={service.imageSrc}
                    title={service.title}
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-full bg-[#EBDCFB] text-[#7d5ea1]">
                        <Icon aria-hidden="true" className="size-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#2D2238]">
                        {service.title}
                      </h3>
                    </div>
                    <p className="mt-5 text-sm leading-7 text-[#5c4b6e]">
                      {service.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {service.included.map((item) => (
                        <Badge
                          className="border-[#BFA2DB]/45 bg-[#FAF7FF] text-[#5c4b6e]"
                          key={item}
                          variant="outline"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                    <GradientButton asChild className="mt-6">
                      <Link href={service.href}>
                        Customize Now
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </Link>
                    </GradientButton>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
