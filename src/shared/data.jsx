const CategoryData = [
  {
    id: 1,
    name: "Players",
    icon: "Players",
    description: "Find players, teammates, and local game partners.",
  },
  {
    id: 2,
    name: "Local Help",
    icon: "Help",
    description: "Find tutors, movers, house help, drivers, and freelancers.",
  },
  {
    id: 3,
    name: "For Sale",
    icon: "Sale",
    description: "Sell useful items locally or discover nearby deals.",
  },
];

const quickFilters = ["Nearby", "Latest", "Popular", "Featured"];

const subCategoryMap = {
  Players: [
    "Cricket",
    "Football",
    "Volleyball",
    "Badminton",
    "Tennis",
    "Basketball",
  ],
  "Local Help": [
    "Tutor",
    "Moving Help",
    "House Help",
    "Driver",
    "Event Volunteer",
    "Freelancer",
  ],
  "For Sale": [
    "Electronics",
    "Furniture",
    "Vehicles",
    "Books",
    "Sports Equipment",
  ],
  Other: ["General", "Help Needed", "Recommendations"],
};

const radiusOptions = ["5 KM", "10 KM", "25 KM", "50 KM", "100 KM"];

const contactPreferences = ["WhatsApp", "Call", "Chat Only"];

export default {
  CategoryData,
  quickFilters,
  subCategoryMap,
  radiusOptions,
  contactPreferences,
};
