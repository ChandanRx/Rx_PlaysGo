const STORAGE_KEY = "quibly_dummy_posts";
const LEGACY_STORAGE_KEY = "playsgo_dummy_posts";
const DEFAULT_POST_IMAGE = "/placeholder-post.svg";
const DEFAULT_AVATAR_IMAGE = "/avatar-placeholder.svg";

const legacyCategoryMap = {
  Sports: "Players",
  Tutor: "Local Help",
  Roommate: "Local Help",
  Services: "Local Help",
  Travel: "Local Help",
  "Buy & Sell": "For Sale",
};

const normalizeCategory = (category) =>
  legacyCategoryMap[category] || category || "Other";

const categoryMatchers = {
  players: ["players", "sports"],
  "local help": ["local help", "tutor", "services", "roommate", "travel"],
  "for sale": ["for sale", "buy & sell"],
};

const matchesCategory = (postCategory, selectedCategory) => {
  if (!selectedCategory) {
    return true;
  }

  const normalizedPostCategory = postCategory.trim().toLowerCase();
  const normalizedSelectedCategory = selectedCategory.trim().toLowerCase();
  const aliases = categoryMatchers[normalizedSelectedCategory] || [
    normalizedSelectedCategory,
  ];

  return aliases.includes(normalizedPostCategory);
};

export const dummyUser = {
  name: "Chandan Pargi",
  username: "chandan.pargi",
  email: "chandan@quibly.local",
  mobile: "+91 98765 43210",
  city: "Mumbai",
  state: "Maharashtra",
  bio: "Building local connections through opportunities, events, and trusted community posts.",
  verified: true,
  image: DEFAULT_AVATAR_IMAGE,
};

const initialPosts = [
  {
    id: "quibly-sports-1",
    title: "Need 4 players for Sunday cricket",
    desc: "We are organizing a friendly tennis-ball match this Sunday morning and need four more players to complete both teams.",
    category: "Players",
    subCategory: "Cricket",
    date: "2026-06-22",
    time: "07:00 AM",
    duration: "2 hours",
    location: "Shivaji Park, Mumbai",
    radius: "10 KM",
    distance: "3.2 km away",
    postedTime: "18 min ago",
    imageUrl: "/posts/cricket.jpg",
    userName: dummyUser.name,
    userImage: dummyUser.image,
    email: dummyUser.email,
    phone: dummyUser.mobile,
    whatsapp: dummyUser.mobile,
    contactPreference: "WhatsApp",
    requiredPeople: "4",
    isVerified: true,
  },
  {
    id: "quibly-tutor-1",
    title: "Looking for a maths tutor for class 10",
    desc: "Need a patient tutor for home sessions twice a week in the evenings. CBSE experience is preferred.",
    category: "Local Help",
    subCategory: "Maths",
    date: "2026-06-24",
    time: "06:30 PM",
    location: "Baner, Pune",
    radius: "5 KM",
    distance: "1.4 km away",
    postedTime: "42 min ago",
    imageUrl: DEFAULT_POST_IMAGE,
    userName: "Riya Kapoor",
    userImage: DEFAULT_AVATAR_IMAGE,
    email: "riya@quibly.local",
    phone: "+91 91234 56780",
    whatsapp: "+91 91234 56780",
    contactPreference: "Call",
    isVerified: true,
  },
  {
    id: "quibly-roommate-1",
    title: "Need a roommate near Koramangala",
    desc: "Furnished 2BHK with internet, washing machine, and balcony. Looking for a clean and working professional flatmate from next month.",
    category: "Local Help",
    subCategory: "Shared Apartment",
    location: "Koramangala, Bengaluru",
    radius: "25 KM",
    distance: "6.8 km away",
    postedTime: "1 hr ago",
    imageUrl: DEFAULT_POST_IMAGE,
    userName: "Aman Verma",
    userImage: DEFAULT_AVATAR_IMAGE,
    email: "aman@quibly.local",
    phone: "+91 92345 67890",
    whatsapp: "+91 92345 67890",
    contactPreference: "Chat Only",
    isVerified: false,
  },
  {
    id: "quibly-services-1",
    title: "Freelance designer available for social media creatives",
    desc: "I help startups and local businesses with branding, social posts, and launch creatives. Fast delivery and flexible pricing.",
    category: "Local Help",
    subCategory: "Design",
    location: "Andheri West, Mumbai",
    radius: "50 KM",
    distance: "9.5 km away",
    postedTime: "2 hrs ago",
    imageUrl: DEFAULT_POST_IMAGE,
    userName: "Priya Nair",
    userImage: DEFAULT_AVATAR_IMAGE,
    email: "priya@quibly.local",
    phone: "+91 93456 78901",
    whatsapp: "+91 93456 78901",
    contactPreference: "WhatsApp",
    isVerified: true,
  },
  {
    id: "quibly-travel-1",
    title: "Looking for a travel partner for a Jaipur weekend trip",
    desc: "Planning a budget-friendly weekend itinerary from Delhi. Looking for one or two easy-going people to split cab and stay.",
    category: "Local Help",
    subCategory: "Travel Partner",
    date: "2026-06-28",
    time: "05:30 AM",
    location: "South Delhi",
    radius: "100 KM",
    distance: "12 km away",
    postedTime: "3 hrs ago",
    imageUrl: DEFAULT_POST_IMAGE,
    userName: "Kabir Singh",
    userImage: DEFAULT_AVATAR_IMAGE,
    email: "kabir@quibly.local",
    phone: "+91 94567 89012",
    whatsapp: "+91 94567 89012",
    contactPreference: "WhatsApp",
    isVerified: false,
  },
  {
    id: "quibly-buysell-1",
    title: "Selling ergonomic study desk and chair",
    desc: "Well-maintained setup, ideal for students or remote work. Pickup preferred this weekend.",
    category: "For Sale",
    subCategory: "Furniture",
    location: "Indiranagar, Bengaluru",
    radius: "10 KM",
    distance: "2.7 km away",
    postedTime: "5 hrs ago",
    imageUrl: DEFAULT_POST_IMAGE,
    userName: "Neha Joshi",
    userImage: DEFAULT_AVATAR_IMAGE,
    email: "neha@quibly.local",
    phone: "+91 95678 90123",
    whatsapp: "+91 95678 90123",
    contactPreference: "Call",
    isVerified: true,
  },
  {
    id: "quibly-sports-2",
    title: "Football match this Saturday — need 5 more",
    desc: "Casual 7-a-side football game at the ground near Juhu Beach. All skill levels welcome, just bring your boots.",
    category: "Players",
    subCategory: "Football",
    date: "2026-06-28",
    time: "06:00 AM",
    duration: "1.5 hours",
    location: "Juhu Beach Ground, Mumbai",
    radius: "10 KM",
    distance: "4.1 km away",
    postedTime: "30 min ago",
    imageUrl: "/posts/football.jpg",
    userName: "Rahul Mehta",
    userImage: DEFAULT_AVATAR_IMAGE,
    email: "rahul@quibly.local",
    phone: "+91 99001 23456",
    whatsapp: "+91 99001 23456",
    contactPreference: "WhatsApp",
    requiredPeople: "5",
    isVerified: true,
  },
  {
    id: "quibly-sports-3",
    title: "Badminton doubles — looking for 2 players",
    desc: "Playing doubles at the indoor court every Tuesday and Thursday evening. Looking for intermediate-level partners.",
    category: "Players",
    subCategory: "Badminton",
    date: "2026-07-01",
    time: "07:30 PM",
    duration: "1 hour",
    location: "Kandivali Sports Club, Mumbai",
    radius: "8 KM",
    distance: "2.0 km away",
    postedTime: "1 hr ago",
    imageUrl: "/posts/badminton.jpg",
    userName: "Sneha Iyer",
    userImage: DEFAULT_AVATAR_IMAGE,
    email: "sneha@quibly.local",
    phone: "+91 98112 34567",
    whatsapp: "+91 98112 34567",
    contactPreference: "Call",
    requiredPeople: "2",
    isVerified: false,
  },
  {
    id: "quibly-sports-4",
    title: "Sunday football draft — finalizing lineup",
    desc: "Working out the roster before posting publicly. Not visible to others yet.",
    category: "Players",
    subCategory: "Football",
    location: "Shivaji Park, Mumbai",
    radius: "10 KM",
    distance: "3.2 km away",
    postedTime: "Just now",
    imageUrl: "/posts/football.jpg",
    userName: dummyUser.name,
    userImage: dummyUser.image,
    email: dummyUser.email,
    phone: dummyUser.mobile,
    whatsapp: dummyUser.mobile,
    contactPreference: "WhatsApp",
    requiredPeople: "6",
    isVerified: true,
    status: "Draft",
  },
  {
    id: "quibly-sports-5",
    title: "Badminton pairs — squad filled up",
    desc: "Thanks to everyone who reached out — we found our four players for this week.",
    category: "Players",
    subCategory: "Badminton",
    location: "Kandivali Sports Club, Mumbai",
    radius: "8 KM",
    distance: "2.0 km away",
    postedTime: "1 day ago",
    imageUrl: "/posts/badminton.jpg",
    userName: dummyUser.name,
    userImage: dummyUser.image,
    email: dummyUser.email,
    phone: dummyUser.mobile,
    whatsapp: dummyUser.mobile,
    contactPreference: "WhatsApp",
    requiredPeople: "4",
    isVerified: true,
    status: "Closed",
  },
  {
    id: "quibly-sports-6",
    title: "Cricket net practice — last month's session",
    desc: "Practice session has already passed — keeping this here for reference.",
    category: "Players",
    subCategory: "Cricket",
    date: "2026-05-10",
    time: "07:00 AM",
    location: "Shivaji Park, Mumbai",
    radius: "10 KM",
    distance: "3.2 km away",
    postedTime: "3 weeks ago",
    imageUrl: "/posts/cricket.jpg",
    userName: dummyUser.name,
    userImage: dummyUser.image,
    email: dummyUser.email,
    phone: dummyUser.mobile,
    whatsapp: dummyUser.mobile,
    contactPreference: "WhatsApp",
    requiredPeople: "3",
    isVerified: true,
    status: "Expired",
  },
];

export const POST_STATUSES = ["Active", "Draft", "Closed", "Expired"];

const isBrowser = () => typeof window !== "undefined";

const normalizePost = (post, index = 0) => {
  const category = normalizeCategory(post.category || post.game);
  const subCategory = post.subCategory || post.game || "General";
  const location =
    post.location ||
    post.searchLocation ||
    post.currentLocation ||
    "Location not added";

  return {
    id: post.id || `quibly-${Date.now()}-${index}`,
    title: post.title || "Untitled post",
    desc: post.desc || post.description || "No description added yet.",
    category,
    subCategory,
    date: post.date || post.eventDate || "",
    time: post.time || "",
    duration: post.duration || "",
    location,
    radius: post.radius || "10 KM",
    distance: post.distance || `Within ${post.radius || "10 KM"}`,
    postedTime: post.postedTime || "Recently posted",
    imageUrl: post.imageUrl?.trim() || DEFAULT_POST_IMAGE,
    videoUrl: post.videoUrl?.trim() || "",
    userName: post.userName || dummyUser.name,
    userImage: post.userImage || dummyUser.image,
    email: post.email || dummyUser.email,
    phone: post.phone || dummyUser.mobile,
    whatsapp: post.whatsapp || post.phone || dummyUser.mobile,
    contactPreference: post.contactPreference || "Chat Only",
    requiredPeople: post.requiredPeople || "",
    isVerified: Boolean(post.isVerified),
    featurePost: Boolean(post.featurePost),
    pinPost: Boolean(post.pinPost),
    boostVisibility: Boolean(post.boostVisibility),
    status: post.status || "Active",
  };
};

// Bump this version string whenever initialPosts changes — forces a cache reset
const DATA_VERSION = "v5-post-status-profile-posts";
const VERSION_KEY  = "quibly_data_version";

const readPosts = () => {
  if (!isBrowser()) {
    return initialPosts.map(normalizePost);
  }

  // ── version-based cache bust ─────────────────────────────────────────────
  // If the stored version doesn't match the current DATA_VERSION, wipe all
  // post caches and re-seed from initialPosts so new imageUrls always show.
  const storedVersion = window.localStorage.getItem(VERSION_KEY);
  if (storedVersion !== DATA_VERSION) {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    window.localStorage.setItem(VERSION_KEY, DATA_VERSION);
    const fresh = initialPosts.map(normalizePost);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  // ── normal read from cache ───────────────────────────────────────────────
  const savedPosts = window.localStorage.getItem(STORAGE_KEY);
  if (savedPosts) {
    try {
      return JSON.parse(savedPosts).map(normalizePost);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  // ── first-ever load (no cache yet) ──────────────────────────────────────
  const seededPosts = initialPosts.map(normalizePost);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seededPosts));
  return seededPosts;
};

const writePosts = (posts) => {
  if (isBrowser()) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(posts.map(normalizePost)),
    );
  }
};

export const getPosts = () => readPosts();

export const searchPosts = (searchText = "", category = "") => {
  const normalizedSearch = searchText.trim().toLowerCase();

  return readPosts().filter((post) => {
    const matchesSearch = !normalizedSearch
      ? true
      : [
          post.title,
          post.desc,
          post.category,
          post.subCategory,
          post.location,
          post.userName,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));

    const matchesCategoryFilter = matchesCategory(post.category, category);

    return matchesSearch && matchesCategoryFilter;
  });
};

export const getUserPosts = (email = dummyUser.email) =>
  readPosts().filter((post) => post.email === email);

export const getPostById = (id) => readPosts().find((post) => post.id === id) || null;

export const createPost = (post) => {
  const nextPost = normalizePost({
    ...post,
    id: `quibly-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    location:
      post.searchLocation?.trim() ||
      post.currentLocation?.trim() ||
      post.location?.trim() ||
      "Location not added",
    date: post.eventDate || post.date || "",
    imageUrl: post.imageUrl?.trim() || DEFAULT_POST_IMAGE,
    userName: dummyUser.name,
    userImage: dummyUser.image,
    email: post.email?.trim() || dummyUser.email,
    phone: post.phone?.trim() || dummyUser.mobile,
    whatsapp: post.whatsapp?.trim() || post.phone?.trim() || dummyUser.mobile,
    postedTime: "Just now",
    distance: `Within ${post.radius || "10 KM"}`,
    isVerified: dummyUser.verified,
  });

  writePosts([nextPost, ...readPosts()]);
  return nextPost;
};

export const deletePost = (id) => {
  const remainingPosts = readPosts().filter((post) => post.id !== id);
  writePosts(remainingPosts);
  return remainingPosts;
};

export const updatePost = (id, patch = {}) => {
  const nextPosts = readPosts().map((post) =>
    post.id === id ? normalizePost({ ...post, ...patch }) : post,
  );
  writePosts(nextPosts);
  return nextPosts;
};

const USER_PROFILE_KEY = "quibly_user_profile";
const EDITABLE_PROFILE_FIELDS = ["name", "username", "bio", "city", "state", "mobile"];

// The public dummyUser stays the static fallback/defaults; anything the user
// edits on the Profile page is layered on top of it in localStorage.
export const getStoredUserProfile = () => {
  if (!isBrowser()) return { ...dummyUser };

  try {
    const saved = window.localStorage.getItem(USER_PROFILE_KEY);
    return saved ? { ...dummyUser, ...JSON.parse(saved) } : { ...dummyUser };
  } catch {
    return { ...dummyUser };
  }
};

export const updateUserProfile = (patch = {}) => {
  const next = { ...getStoredUserProfile() };
  EDITABLE_PROFILE_FIELDS.forEach((field) => {
    if (patch[field] !== undefined) next[field] = patch[field];
  });

  if (isBrowser()) {
    window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(next));
  }

  return next;
};
