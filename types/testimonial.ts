export interface Testimonial {
  readonly event: string;
  readonly name: string;
  readonly rating: 1 | 2 | 3 | 4 | 5;
  readonly review: string;
}
