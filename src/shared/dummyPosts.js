const STORAGE_KEY = "playsgo_dummy_posts";
const DEFAULT_POST_IMAGE = "/about.jpg";

export const dummyUser = {
  name: "Demo Player",
  email: "demo.player@playsgo.local",
  image: "/android-chrome-192x192.png",
};

const initialPosts = [
  {
    id: "demo-cricket-1",
    title: "Evening cricket at City Arena",
    desc: "Looking for three players for a friendly tennis-ball cricket match. Bring your own bat if you have one.",
    date: "2026-06-20",
    location: "City Arena, Mumbai",
    game: "Cricket",
    imageUrl: "/about.jpg",
    userName: dummyUser.name,
    userImage: dummyUser.image,
    email: dummyUser.email,
  },
  {
    id: "demo-football-1",
    title: "5-a-side football pickup",
    desc: "Casual game with mixed skill levels. We need two more players to balance the teams.",
    date: "2026-06-22",
    location: "Green Turf, Pune",
    game: "Football",
    imageUrl: "/about.jpg",
    userName: "Arjun Mehta",
    userImage: "/android-chrome-192x192.png",
    email: "arjun@playsgo.local",
  },
  {
    id: "demo-badminton-1",
    title: "Badminton doubles practice",
    desc: "Intermediate doubles practice session. Court is already booked for one hour.",
    date: "2026-06-24",
    location: "Indoor Sports Club, Bengaluru",
    game: "Badminton",
    imageUrl: "/about.jpg",
    userName: "Nisha Rao",
    userImage: "/android-chrome-192x192.png",
    email: "nisha@playsgo.local",
  },
  {
    id: "demo-chess-1",
    title: "Weekend rapid chess meetup",
    desc: "Rapid games and friendly analysis afterward. All ratings are welcome.",
    date: "2026-06-27",
    location: "Central Library Cafe, Delhi",
    game: "Chess",
    imageUrl: "/about.jpg",
    userName: dummyUser.name,
    userImage: dummyUser.image,
    email: dummyUser.email,
  },
];

const isBrowser = () => typeof window !== "undefined";

const readPosts = () => {
  if (!isBrowser()) {
    return initialPosts;
  }

  const savedPosts = window.localStorage.getItem(STORAGE_KEY);
  if (!savedPosts) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPosts));
    return initialPosts;
  }

  try {
    return JSON.parse(savedPosts);
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPosts));
    return initialPosts;
  }
};

const writePosts = (posts) => {
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }
};

export const getPosts = () => readPosts();

export const searchPosts = (searchText) => {
  const normalizedSearch = searchText.trim().toLowerCase();
  if (!normalizedSearch) {
    return readPosts();
  }

  return readPosts().filter((post) =>
    post.game.toLowerCase().includes(normalizedSearch)
  );
};

export const getUserPosts = (email = dummyUser.email) =>
  readPosts().filter((post) => post.email === email);

export const createPost = (post) => {
  const nextPost = {
    ...post,
    id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    imageUrl: post.imageUrl?.trim() || DEFAULT_POST_IMAGE,
    userName: dummyUser.name,
    userImage: dummyUser.image,
    email: dummyUser.email,
  };

  writePosts([nextPost, ...readPosts()]);
  return nextPost;
};

export const deletePost = (id) => {
  const remainingPosts = readPosts().filter((post) => post.id !== id);
  writePosts(remainingPosts);
  return remainingPosts;
};
