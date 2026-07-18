export type PackageTier = "Silver" | "Gold" | "Diamond" | "Royal" | "Platinum";

export interface EventPackage {
  readonly brochurePath: string;
  readonly description: string;
  readonly includedServices: readonly string[];
  readonly name: PackageTier;
  readonly price: string;
  readonly recommendedFor: string;
  readonly services: {
    readonly accommodation: boolean;
    readonly anchor: boolean;
    readonly band: boolean;
    readonly decoration: boolean;
    readonly drone: boolean;
    readonly fireworks: boolean;
    readonly flowers: boolean;
    readonly food: boolean;
    readonly led: boolean;
    readonly lighting: boolean;
    readonly luxuryEntry: boolean;
    readonly photography: boolean;
  };
}
