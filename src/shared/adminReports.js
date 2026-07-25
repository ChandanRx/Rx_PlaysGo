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

// Reasons offered to members on the post card. Kept here (not in the modal) so
// the admin "reports by reason" breakdown groups on a fixed set of labels.
export const REPORT_REASONS = [
  "Spam or scam",
  "Misleading or fake listing",
  "Inappropriate content",
  "Suspicious contact request",
  "Duplicate post",
  "Something else",
];

// Lets post cards re-check their "already reported" state when a report is
// filed or dismissed anywhere, same pattern as FOLLOW_CHANGE_EVENT.
export const REPORTS_CHANGE_EVENT = "quibly-reports-change";

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
    window.dispatchEvent(new CustomEvent(REPORTS_CHANGE_EVENT));
  }
};

export const getReports = () => readReports();

// A member flagged a post from the feed. New reports land at the top of the
// admin queue as "Pending", same shape as the seeded ones.
export const addReport = ({ postId, reason, details = "", reportedBy = "" }) => {
  const report = {
    id: `report-${Date.now()}`,
    postId,
    reason,
    details: details.trim(),
    reportedBy: reportedBy || "anonymous",
    status: "Pending",
    reportedAt: "just now",
  };

  writeReports([report, ...readReports()]);
  return report;
};

// Used by the post card to show an already-reported state instead of letting
// the same member file the same report twice.
export const hasReportedPost = (postId, reportedBy = "") => {
  if (!postId) return false;
  const who = reportedBy || "anonymous";
  return readReports().some((report) => report.postId === postId && report.reportedBy === who);
};

export const dismissReport = (id) => {
  const next = readReports().map((report) =>
    report.id === id ? { ...report, status: "Dismissed" } : report,
  );
  writeReports(next);
  return next;
};
