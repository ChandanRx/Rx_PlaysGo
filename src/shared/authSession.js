import { getGenderAvatar } from "./doodleAvatars";

const SESSION_KEY = "quibly_auth_session";
export const AUTH_CHANGE_EVENT = "quibly-auth-change";

// Fallback for sign-ins that don't pick an avatar (e.g. the Google demo flow).
const DEFAULT_AVATAR_IMAGE = getGenderAvatar("neutral", 3);

const isBrowser = () => typeof window !== "undefined";

// "riya.kapoor_19" → "Riya Kapoor 19" — a friendly display name for sign-ins
// that only provide an email address.
const nameFromEmail = (email) =>
  email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ") || "Member";

export const getStoredSession = () => {
  if (!isBrowser()) return null;

  try {
    const saved = window.localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const persistSession = (session) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: session }));
  return session;
};

// Mock auth — no backend yet. Any credentials are accepted; the "session" is
// just a profile blob in localStorage, same idea as getStoredUserProfile().
export const signIn = ({
  email,
  name = "",
  image = "",
  mobile = "",
  gender = "",
  asAdmin = false,
}) => {
  if (!isBrowser()) return null;

  const cleanEmail = email.trim().toLowerCase();

  return persistSession({
    name: name.trim() || nameFromEmail(cleanEmail),
    username: cleanEmail.split("@")[0],
    email: cleanEmail,
    role: asAdmin ? "admin" : "member",
    image: image || DEFAULT_AVATAR_IMAGE,
    mobile: mobile.trim(),
    gender,
    signedInAt: new Date().toISOString(),
  });
};

export const signUp = ({ name, email, image, mobile, gender }) =>
  signIn({ name, email, image, mobile, gender });

export const signOut = () => {
  if (!isBrowser()) return;

  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: null }));
};

export const isAdminSession = (session = getStoredSession()) =>
  session?.role === "admin";
