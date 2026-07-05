// v1 mock notifications store — localStorage backed, same pattern as
// dummyPosts.js / adminReports.js. `icon` is a string key mapped to a lucide
// icon by whichever component renders the list.
const STORAGE_KEY = "quibly_notifications";
export const NOTIFICATIONS_CHANGE_EVENT = "quibly-notifications-change";

const seedNotifications = [
  { id: "notif-1", icon: "reply", title: "Riya replied to your cricket post", time: "18m ago", read: false, href: "/messages/riya" },
  { id: "notif-2", icon: "message", title: "New message from Priya Nair", time: "1h ago", read: false, href: "/messages/priya" },
  { id: "notif-3", icon: "live", title: "Your post \"Sunday Cricket\" is live", time: "2h ago", read: true, href: "/profile" },
  { id: "notif-4", icon: "badge", title: "You're now a verified poster", time: "1d ago", read: true, href: "/profile" },
];

const isBrowser = () => typeof window !== "undefined";

const readNotifications = () => {
  if (!isBrowser()) return seedNotifications;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedNotifications));
  return seedNotifications;
};

const writeNotifications = (notifications) => {
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_CHANGE_EVENT));
  }
};

export const getNotifications = () => readNotifications();

export const getUnreadNotificationCount = () =>
  readNotifications().filter((n) => !n.read).length;

export const markNotificationRead = (id) => {
  const next = readNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
  writeNotifications(next);
  return next;
};

export const markAllNotificationsRead = () => {
  const next = readNotifications().map((n) => ({ ...n, read: true }));
  writeNotifications(next);
  return next;
};
