export type AppRoute =
  | "/"
  | "/about"
  | "/admin"
  | "/blog"
  | `/blog/${string}`
  | "/booking"
  | "/budget-calculator"
  | "/client"
  | "/contact"
  | "/customize"
  | "/customize/success"
  | "/dashboard"
  | "/events"
  | "/gallery"
  | "/packages"
  | "/portfolio"
  | "/privacy-policy"
  | "/refund-policy"
  | "/services"
  | "/terms-and-conditions"
  | "/themes"
  | "/venues";

export interface NavigationItem {
  readonly description?: string;
  readonly disabled?: boolean;
  readonly external?: boolean;
  readonly href: AppRoute | `#${string}` | `https://${string}`;
  readonly label: string;
}
