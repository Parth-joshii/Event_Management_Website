/** Renders the route loading state. */
export default function Loading(): React.ReactElement {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-dvh items-center justify-center bg-[#FAF7FF] px-6"
    >
      <div className="text-center">
        <div className="mx-auto size-14 animate-spin rounded-full border border-[#D4AF37]/40 border-t-[#2D2238]" />
        <p className="mt-5 text-sm font-semibold tracking-[0.2em] text-[#2D2238] uppercase">
          Preparing Luxury
        </p>
      </div>
    </main>
  );
}
