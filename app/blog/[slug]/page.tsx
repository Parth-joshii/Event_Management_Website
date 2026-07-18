import type { Metadata } from "next";
import Link from "next/link";
import { Share2 } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/layout/json-ld";
import { Container } from "@/components/layout/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { PortfolioCard } from "@/components/showcase/portfolio-card";
import { ShowcaseHero } from "@/components/showcase/showcase-hero";
import { blogPosts } from "@/features/blogs/data/blog-posts";
import { optionalPublicAsset } from "@/lib/public-assets";
import { siteConfig } from "@/config/site";
import { createBlogPostJsonLd, createBreadcrumbJsonLd } from "@/utils/structured-data";

interface BlogPostPageProps {
  readonly params: Promise<{
    readonly slug: string;
  }>;
}

export function generateStaticParams(): { slug: string }[] {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return { title: "Article Not Found | Shree Velora Event's" };
  }

  return {
    alternates: { canonical: `${siteConfig.url}/blog/${post.slug}` },
    description: post.description,
    openGraph: {
      description: post.description,
      title: `${post.title} | Shree Velora Event's`,
      type: "article",
      url: `${siteConfig.url}/blog/${post.slug}`
    },
    title: `${post.title} | Shree Velora Event's`
  };
}

/** Renders a single SEO-ready blog article. */
export default async function BlogPostPage({
  params
}: BlogPostPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug) ?? blogPosts[0];
  const relatedSlugs: readonly string[] = post.relatedSlugs;
  const related = blogPosts.filter((item) => relatedSlugs.includes(item.slug));
  const logoSrc = optionalPublicAsset("/logos/logo.png");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { href: "/", label: "Home" },
          { href: "/blog", label: "Blog" },
          { href: `/blog/${post.slug}`, label: post.title }
        ])}
      />
      <JsonLd data={createBlogPostJsonLd(post)} />
      <Header logoSrc={logoSrc} navigationHrefPrefix="/" />
      <main id="main-content">
        <ShowcaseHero
          breadcrumbs={[{ href: "/blog", label: "Blog" }, { label: post.title }]}
          description={post.description}
          eyebrow={post.category}
          title={post.title}
        />
        <article className="bg-[#FAF7FF] py-16 sm:py-20">
          <Container className="max-w-4xl">
            <ResponsiveImage
              alt={post.imageAlt}
              className="h-[28rem] rounded-lg"
              fallbackClassName={post.fallbackClassName}
              sizes="100vw"
              src={post.imageSrc}
              title={post.title}
            />
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[#5c4b6e]">
              <span>{post.author}</span>
              <span>{post.date}</span>
              <span>{post.readingTime}</span>
              <GradientButton asChild tone="light">
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
                    `${post.title} - ${siteConfig.url}/blog/${post.slug}`
                  )}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Share2 aria-hidden="true" className="size-4" />
                  Share
                </a>
              </GradientButton>
            </div>
            <div className="mt-10 grid gap-8">
              {post.content.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-3xl font-semibold text-[#2D2238]">
                    {section.heading}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#5c4b6e]">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
            <div className="mt-14">
              <h2 className="font-display text-3xl font-semibold text-[#2D2238]">
                Related Posts
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {related.map((item) => (
                  <PortfolioCard
                    badge={item.category}
                    description={item.description}
                    fallbackClassName={item.fallbackClassName}
                    href={`/blog/${item.slug}`}
                    imageAlt={item.imageAlt}
                    imageSrc={item.imageSrc}
                    key={item.slug}
                    meta={[item.readingTime, item.date]}
                    title={item.title}
                  />
                ))}
              </div>
            </div>
            <GradientButton asChild className="mt-12">
              <Link href="/blog">Back To Blog</Link>
            </GradientButton>
          </Container>
        </article>
      </main>
      <Footer />
    </>
  );
}
