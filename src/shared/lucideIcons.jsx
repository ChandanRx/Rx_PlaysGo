import {
  ArchiveBoxIcon,
  BoltIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CalculatorIcon,
  CalendarDaysIcon,
  ComputerDesktopIcon,
  CubeIcon,
  FireIcon,
  HandRaisedIcon,
  HomeIcon,
  HomeModernIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  ShoppingBagIcon,
  SwatchIcon,
  TrophyIcon,
  TruckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export const CATEGORY_ICONS = {
  Players: TrophyIcon,
  "Local Help": HandRaisedIcon,
  "For Sale": ShoppingBagIcon,
};

export const FEATURE_ICONS = {
  "Find players for a match": TrophyIcon,
  "Look for a tutor or freelancer": BookOpenIcon,
  "Post local jobs or gigs": BriefcaseIcon,
  "Sell furniture or electronics": CubeIcon,
  "Discover events and communities": CalendarDaysIcon,
  "Find a roommate or travel partner": HomeModernIcon,
};

export const SUBCATEGORY_ICONS = {
  Cricket: TrophyIcon,
  Football: TrophyIcon,
  Volleyball: BoltIcon,
  Badminton: FireIcon,
  Tennis: TrophyIcon,
  Basketball: TrophyIcon,
  Tutor: BookOpenIcon,
  Maths: CalculatorIcon,
  Design: SwatchIcon,
  "Moving Help": ArchiveBoxIcon,
  "House Help": HomeIcon,
  Driver: TruckIcon,
  "Event Volunteer": UsersIcon,
  Freelancer: BriefcaseIcon,
  "Travel Partner": PaperAirplaneIcon,
  "Shared Apartment": HomeModernIcon,
  Electronics: ComputerDesktopIcon,
  Furniture: CubeIcon,
  Vehicles: TruckIcon,
  Books: BookOpenIcon,
  "Sports Equipment": FireIcon,
};

export const DEFAULT_CATEGORY_ICON = MapPinIcon;
