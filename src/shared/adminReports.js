// v1 mock flagged-posts store for the admin Reports tab — localStorage backed
// so dismissals persist, same pattern as dummyPosts.js.
const STORAGE_KEY = "quibly_admin_reports";

const seedReports = [
  {
    id: "report-1",
    postId: "quibly-roommate-1",
    reason: "Suspicious contact request",
    reportedBy: "anonymous",
    status: "Pending",
    reportedAt: "2 hours ago",
  },
  {
    id: "report-2",
    postId: "quibly-buysell-1",
    reason: "Price seems misleading",
    reportedBy: "neha@quibly.local",
    status: "Pending",
    reportedAt: "1 day ago",
  },
  {
    id: "report-3",
    postId: "quibly-travel-1",
    reason: "Duplicate post",
    reportedBy: "kabir@quibly.local",
    status: "Dismissed",
    reportedAt: "3 days ago",
  },
];

const isBrowser = () => typeof window !== "undefined";

const readReports = () => {
  if (!isBrowser()) return seedReports;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedReports));
  return seedReports;
};

const writeReports = (reports) => {
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }
};

export const getReports = () => readReports();

export const dismissReport = (id) => {
  const next = readReports().map((report) =>
    report.id === id ? { ...report, status: "Dismissed" } : report,
  );
  writeReports(next);
  return next;
};
