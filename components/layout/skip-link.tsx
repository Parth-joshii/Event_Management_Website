/** Renders a keyboard-accessible skip link for primary content. */
export function SkipLink(): React.ReactElement {
  return (
    <a
      className="bg-background text-foreground focus:ring-ring fixed top-3 left-3 z-100 -translate-y-16 rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-transform focus:translate-y-0 focus:ring-2 focus:outline-none"
      href="#main-content"
    >
      Skip to content
    </a>
  );
}
