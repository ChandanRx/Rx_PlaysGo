"use client";

import React, { useEffect, useState } from "react";
import { FlagIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deletePost, getPostById } from "../../shared/dummyPosts";
import { dismissReport, getReports } from "../../shared/adminStore";
import { AdminEmpty, AdminLoading } from "./AdminTableState";

const AdminReportsTable = ({ onDataChange }) => {
  const [reports, setReports] = useState(null);

  const refresh = () => setReports(getReports());
  useEffect(() => { refresh(); }, []);

  const handleDismiss = (id) => {
    dismissReport(id);
    refresh();
    onDataChange?.();
  };

  const handleRemovePost = (report) => {
    deletePost(report.postId);
    dismissReport(report.id);
    refresh();
    onDataChange?.();
  };

  if (reports === null) return <AdminLoading rows={3} />;

  if (reports.length === 0) {
    return (
      <AdminEmpty
        icon={FlagIcon}
        title="No reports"
        message="Nothing has been flagged by the community. Reports land here for review."
      />
    );
  }

  const pending = reports.filter((r) => r.status === "Pending");
  // Pending reports first — they're the ones needing action.
  const sorted = [...reports].sort((a, b) => (a.status === "Pending" ? 0 : 1) - (b.status === "Pending" ? 0 : 1));

  return (
    <div>
      <p className="text-[11.5px] font-medium text-[var(--text-faint)]">
        {pending.length === 0
          ? "All reports handled — nothing pending."
          : `${pending.length} pending report${pending.length === 1 ? "" : "s"} need${pending.length === 1 ? "s" : ""} review`}
      </p>

      <div className="mt-2 space-y-2.5">
        {sorted.map((report) => {
          const post = getPostById(report.postId);
          const isPending = report.status === "Pending";
          return (
            <div
              key={report.id}
              className={`flex flex-col gap-2.5 rounded-xl border p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                isPending
                  ? "border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-strong)]"
                  : "border-[var(--border-light)] bg-[var(--bg-secondary)]/50 opacity-75"
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[var(--text-heading)]">
                  {post?.title || "Post already removed"}
                </p>
                <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
                  {report.reason} · reported by {report.reportedBy} · {report.reportedAt}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-md px-2 py-1 text-[10.5px] font-semibold ${
                    isPending
                      ? "bg-amber-100 text-amber-700"
                      : "bg-[var(--bg-input)] text-[var(--text-faint)]"
                  }`}
                >
                  {report.status}
                </span>
                {isPending && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDismiss(report.id)}
                      className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-[12px] font-semibold text-[var(--text-body)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePost(report)}
                      disabled={!post}
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-soft)] px-3 py-1.5 text-[12px] font-semibold text-[var(--danger)] transition hover:bg-[var(--danger-border)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <TrashIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                      Remove post
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminReportsTable;
