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

// Week-over-week deltas for the four KPI tiles. There are no historical metric
// snapshots in the mock data layer, so the post's `date` field (the same
// activity stand-in getWeeklyActivity uses) is the only time signal available:
// posts are bucketed into weeks and the two most-recent *populated* weeks are
// compared (trailing empty weeks are skipped so a quiet current week can't read
// as -100%). Reports carry only relative "N ago" strings, so their delta buckets
// pending reports by a coarse age parse. Each metric returns { direction, pct }:
//   direction: "up" | "down" | "flat" | "new" (prev week was empty) | null (no data)
const pctDelta = (current, previous) => {
  if (previous === 0 && current === 0) return null;
  if (previous === 0) return { direction: "new", pct: null };
  if (current === previous) return { direction: "flat", pct: 0 };
  const pct = Math.round(((current - previous) / previous) * 100);
  return { direction: pct > 0 ? "up" : "down", pct };
};

// "2 hours ago" → 0, "1 day ago" → 1, "3 weeks ago" → 21. Coarse; only used to
// split reports into this-week / last-week buckets.
const ageInDays = (label = "") => {
  const match = String(label).match(/(\d+)\s*(hour|day|week|month)/i);
  if (!match) return 0;
  const n = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.startsWith("hour")) return 0;
  if (unit.startsWith("day")) return n;
  if (unit.startsWith("week")) return n * 7;
  return n * 30;
};

export const getKpiDeltas = (posts = getPosts(), reports = []) => {
  const byWeek = new Map();
  posts.forEach((post) => {
    const d = post.date ? new Date(post.date) : null;
    if (!d || Number.isNaN(d.getTime())) return;
    const key = startOfWeek(d).getTime();
    if (!byWeek.has(key)) byWeek.set(key, []);
    byWeek.get(key).push(post);
  });

  const weekKeys = Array.from(byWeek.keys()).sort((a, b) => a - b);
  const last = weekKeys.length ? byWeek.get(weekKeys[weekKeys.length - 1]) : [];
  const prev = weekKeys.length > 1 ? byWeek.get(weekKeys[weekKeys.length - 2]) : [];

  const activeOf = (arr) => arr.filter((p) => (p.status || "Active") === "Active").length;
  const usersOf = (arr) => new Set(arr.map((p) => p.email)).size;

  const pendingInWindow = (lo, hi) =>
    reports.filter((r) => r.status === "Pending" && ageInDays(r.reportedAt) >= lo && ageInDays(r.reportedAt) <= hi).length;

  return {
    totalPosts: pctDelta(last.length, prev.length),
    activePosts: pctDelta(activeOf(last), activeOf(prev)),
    uniqueUsers: pctDelta(usersOf(last), usersOf(prev)),
    pendingReports: pctDelta(pendingInWindow(0, 6), pendingInWindow(7, 13)),
  };
};

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

// Per-category weekly counts over a shared week axis — one real series per
// category for the overview performance chart. Uses the same `date` activity
// stand-in as getWeeklyActivity (see its note).
export const getWeeklyByCategory = (posts = getPosts()) => {
  const weeks = getWeeklyActivity(posts).map((w) => ({ label: w.label, start: w.start }));
  const series = CATEGORY_ORDER.map((category) => {
    const counts = new Map(weeks.map((w) => [w.start.getTime(), 0]));
    posts.forEach((post) => {
      if (post.category !== category) return;
      const d = post.date ? new Date(post.date) : null;
      if (!d || Number.isNaN(d.getTime())) return;
      const key = startOfWeek(d).getTime();
      if (counts.has(key)) counts.set(key, counts.get(key) + 1);
    });
    return { key: category, values: weeks.map((w) => counts.get(w.start.getTime()) || 0) };
  });
  return { labels: weeks.map((w) => w.label), series };
};
