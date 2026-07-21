// Derived analytics for the admin dashboard, computed from the existing local
// data layer (dummyPosts.js via localStorage). Pure functions over getPosts().
import { getPosts } from "../../shared/dummyPosts";

export const CATEGORY_ORDER = ["Players", "Local Help", "For Sale"];

// Posts per category, in fixed category order; unknown categories appended so
// nothing silently disappears from the share chart.
export const getCategoryCounts = (posts = getPosts()) => {
  const counts = new Map(CATEGORY_ORDER.map((category) => [category, 0]));
  posts.forEach((post) => {
    counts.set(post.category, (counts.get(post.category) || 0) + 1);
  });
  return Array.from(counts, ([category, count]) => ({ category, count }));
};

// Posts per subcategory (top `limit`), each tagged with its parent category so
// bars can reuse the category colors.
export const getSubcategoryCounts = (posts = getPosts(), limit = 8) => {
  const bySub = new Map();
  posts.forEach((post) => {
    const key = post.subCategory || "General";
    const entry = bySub.get(key) || { label: key, category: post.category, count: 0 };
    entry.count += 1;
    bySub.set(key, entry);
  });
  return Array.from(bySub.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Posts per lifecycle status, in fixed order (matches POST_STATUSES).
export const getStatusCounts = (posts = getPosts()) => {
  const order = ["Active", "Draft", "Closed", "Expired"];
  const counts = new Map(order.map((status) => [status, 0]));
  posts.forEach((post) => {
    const status = post.status || "Active";
    counts.set(status, (counts.get(status) || 0) + 1);
  });
  return Array.from(counts, ([status, count]) => ({ status, count }));
};

// Top cities by post volume. Location strings look like "Area, City" — the
// last comma-separated token is the city; single-token locations pass through.
export const getTopCities = (posts = getPosts(), limit = 6) => {
  const byCity = new Map();
  posts.forEach((post) => {
    const parts = String(post.location || "").split(",");
    const city = parts[parts.length - 1].trim() || "Unknown";
    byCity.set(city, (byCity.get(city) || 0) + 1);
  });
  return Array.from(byCity, ([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Posts that carry a parsable `date` (the event-date stand-in — see the note
// on getWeeklyActivity), newest first.
export const getDatedPosts = (posts = getPosts()) =>
  posts
    .map((post) => ({ ...post, dateObj: post.date ? new Date(post.date) : null }))
    .filter((post) => post.dateObj && !Number.isNaN(post.dateObj.getTime()))
    .sort((a, b) => b.dateObj - a.dateObj);

const startOfWeek = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // back to Monday
  return d;
};

const shortDate = (date) =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

// Posts bucketed per week. NOTE: post records have no real created-at
// timestamp, so the `date` field (the post's scheduled/event date) is used as
// the activity signal — a stand-in until a real createdAt exists. Posts
// without a parsable date are excluded from the trend.
export const getWeeklyActivity = (posts = getPosts()) => {
  const dated = posts
    .map((post) => (post.date ? new Date(post.date) : null))
    .filter((d) => d && !Number.isNaN(d.getTime()));
  if (dated.length === 0) return [];

  const counts = new Map();
  let min = Infinity;
  let max = -Infinity;
  dated.forEach((d) => {
    const week = startOfWeek(d).getTime();
    counts.set(week, (counts.get(week) || 0) + 1);
    if (week < min) min = week;
    if (week > max) max = week;
  });

  // Fill empty weeks so the time axis is continuous (date arithmetic, not
  // fixed-ms steps, so a DST shift can't misalign week starts).
  const weeks = [];
  for (let start = new Date(min); start.getTime() <= max; start.setDate(start.getDate() + 7)) {
    const weekStart = new Date(start);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    weeks.push({
      start: weekStart,
      label: shortDate(weekStart),
      rangeLabel: `${shortDate(weekStart)} – ${shortDate(end)}`,
      count: counts.get(weekStart.getTime()) || 0,
    });
  }
  return weeks;
};
