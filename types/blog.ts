export type BlogCategory =
  "Wedding" | "Corporate" | "Birthday" | "Decoration" | "Planning" | "Tips";

export interface BlogPost {
  readonly author: string;
  readonly category: BlogCategory;
  readonly content: readonly {
    readonly body: string;
    readonly heading: string;
  }[];
  readonly date: string;
  readonly description: string;
  readonly featured: boolean;
  readonly fallbackClassName: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly readingTime: string;
  readonly relatedSlugs: readonly string[];
  readonly slug: string;
  readonly title: string;
}
