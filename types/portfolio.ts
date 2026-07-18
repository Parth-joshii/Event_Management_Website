export interface PortfolioMetric {
  readonly label: string;
  readonly suffix?: string;
  readonly value: number;
}

export interface PortfolioHighlight {
  readonly description: string;
  readonly fallbackClassName: string;
  readonly imageSrc: string;
  readonly title: string;
}

export interface PortfolioVideo {
  readonly category:
    "Wedding" | "Corporate" | "Birthday" | "Drone" | "Reels" | "Highlights";
  readonly description: string;
  readonly fallbackClassName: string;
  readonly posterSrc: string;
  readonly title: string;
  readonly videoSrc: string;
}

export interface ClientSuccessStory {
  readonly budget: string;
  readonly guestExperience: string;
  readonly slug: string;
  readonly steps: readonly {
    readonly description: string;
    readonly label: string;
  }[];
  readonly title: string;
}
