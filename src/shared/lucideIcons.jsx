import {
  Armchair,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  Car,
  Dumbbell,
  Handshake,
  House,
  Laptop,
  MapPin,
  Package,
  Palette,
  PartyPopper,
  Plane,
  ShoppingBag,
  Sofa,
  Trophy,
  Users,
  Volleyball,
} from "lucide-react";

export const CATEGORY_ICONS = {
  Players: Trophy,
  "Local Help": Handshake,
  "For Sale": ShoppingBag,
};

export const FEATURE_ICONS = {
  "Find players for a match": Trophy,
  "Look for a tutor or freelancer": BookOpen,
  "Post local jobs or gigs": BriefcaseBusiness,
  "Sell furniture or electronics": Armchair,
  "Discover events and communities": PartyPopper,
  "Find a roommate or travel partner": Sofa,
};

export const SUBCATEGORY_ICONS = {
  Cricket: Trophy,
  Football: Trophy,
  Volleyball,
  Badminton: Dumbbell,
  Tennis: Trophy,
  Basketball: Trophy,
  Tutor: BookOpen,
  Maths: Calculator,
  Design: Palette,
  "Moving Help": Package,
  "House Help": House,
  Driver: Car,
  "Event Volunteer": Users,
  Freelancer: BriefcaseBusiness,
  "Travel Partner": Plane,
  "Shared Apartment": Sofa,
  Electronics: Laptop,
  Furniture: Armchair,
  Vehicles: Car,
  Books: BookOpen,
  "Sports Equipment": Dumbbell,
};

export const DEFAULT_CATEGORY_ICON = MapPin;
