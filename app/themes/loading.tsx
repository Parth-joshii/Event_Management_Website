import { Container } from "@/components/layout/container";
import { SkeletonLoader } from "@/components/showcase/skeleton-loader";

/** Renders the themes loading state. */
export default function ThemesLoading(): React.ReactElement {
  return (
    <main className="bg-[#FAF7FF] px-4 py-32">
      <Container>
        <SkeletonLoader count={6} />
      </Container>
    </main>
  );
}
