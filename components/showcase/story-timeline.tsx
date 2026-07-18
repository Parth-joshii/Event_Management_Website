interface StoryTimelineProps {
  readonly steps: readonly {
    readonly description: string;
    readonly label: string;
  }[];
}

/** Renders an animated-feeling story timeline with numbered steps. */
export function StoryTimeline({ steps }: StoryTimelineProps): React.ReactElement {
  return (
    <div className="relative grid gap-5">
      <div className="absolute top-0 left-5 h-full w-px bg-[#BFA2DB]/60" />
      {steps.map((step, index) => (
        <article
          className="relative grid grid-cols-[2.5rem_1fr] gap-4"
          key={step.label}
        >
          <span className="relative z-10 flex size-10 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-white text-sm font-bold text-[#2D2238]">
            {index + 1}
          </span>
          <div className="rounded-lg border border-white/70 bg-white/78 p-5 shadow-sm">
            <h3 className="font-semibold text-[#2D2238]">{step.label}</h3>
            <p className="mt-2 text-sm leading-7 text-[#5c4b6e]">{step.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
