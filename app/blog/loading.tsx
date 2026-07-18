import { Container } from "@/components/layout/container";
import { SkeletonLoader } from "@/components/showcase/skeleton-loader";

export default function BlogLoading(): React.ReactElement {
  return (
    <main className="bg-[#FAF7FF] px-4 py-32">
      <Container>
        <SkeletonLoader count={6} />
      </Container>
    </main>
  );
}
