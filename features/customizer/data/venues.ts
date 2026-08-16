export interface VenueOption {
  readonly description: string;
  readonly iconName: string;
  readonly id: string;
  readonly title: string;
}

export const venueOptionsData: readonly VenueOption[] = [
  { id: "indoor", title: "Indoor", description: "Climate-controlled luxury halls & ballroom spaces.", iconName: "Building" },
  { id: "outdoor", title: "Outdoor", description: "Open-air lawn, starlit garden & terrace setups.", iconName: "Trees" },
  { id: "banquet", title: "Banquet", description: "Dedicated banquet halls with grand stage infrastructure.", iconName: "Building2" },
  { id: "hotel", title: "Hotel", description: "5-Star hotel ballrooms with guest stay amenities.", iconName: "Hotel" },
  { id: "resort", title: "Resort", description: "Luxury resort properties with pool & garden lawns.", iconName: "Palmtree" },
  { id: "farmhouse", title: "Farmhouse", description: "Private estate farmhouses for exclusive gatherings.", iconName: "Home" },
  { id: "palace", title: "Palace", description: "Heritage palaces & royal forts for imperial weddings.", iconName: "Castle" },
  { id: "garden", title: "Garden", description: "Natural botanical lawns surrounded by lush greenery.", iconName: "Flower" },
  { id: "destination", title: "Destination", description: "Exotic beach, hill-station or heritage destination.", iconName: "Plane" },
  { id: "no-preference", title: "No Preference", description: "Open to expert venue recommendations from our team.", iconName: "HelpCircle" }
];
