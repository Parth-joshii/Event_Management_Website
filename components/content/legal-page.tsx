import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";

interface LegalPageContentProps {
  readonly sections: readonly {
    readonly body: string;
    readonly heading: string;
  }[];
  readonly title: string;
  readonly updatedAt: string;
}

/** Renders a professionally structured public legal page. */
export function LegalPageContent({
  sections,
  title,
  updatedAt
}: LegalPageContentProps): React.ReactElement {
  return (
    <section className="bg-[#FAF7FF] py-16 sm:py-20">
      <Container className="max-w-4xl">
        <SectionHeading
          align="left"
          eyebrow={`Updated ${updatedAt}`}
          title={title}
          description="Please read this page carefully. Final event-specific terms are confirmed in the written quotation or agreement."
        />
        <div className="mt-10 grid gap-5">
          {sections.map((section) => (
            <article
              className="rounded-lg border border-white/70 bg-white/82 p-6 shadow-sm"
              key={section.heading}
            >
              <h2 className="text-xl font-semibold text-[#2D2238]">
                {section.heading}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5c4b6e]">{section.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
