"use client";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { deletePost, getPostById } from "../../shared/dummyPosts";
import { dismissReport, getReports } from "../../shared/adminStore";

const AdminReportsTable = ({ onDataChange }) => {
  const [reports, setReports] = useState([]);

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

  if (reports.length === 0) {
    return <p className="py-8 text-center text-[13px] text-[var(--text-muted)]">No reports yet.</p>;
  }

  return (
    <div className="space-y-2.5">
      {reports.map((report) => {
        const post = getPostById(report.postId);
        return (
          <div
            key={report.id}
            className="flex flex-col gap-2.5 rounded-sm border border-[var(--border-subtle)] p-3.5 sm:flex-row sm:items-center sm:justify-between"
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
                className={`rounded-sm px-2 py-1 text-[10.5px] font-semibold ${
                  report.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-[var(--bg-input)] text-[var(--text-faint)]"
                }`}
              >
                {report.status}
              </span>
              {report.status === "Pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleDismiss(report.id)}
                    className="rounded-sm border border-[var(--border-subtle)] px-3 py-1.5 text-[12px] font-semibold text-[var(--text-body)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePost(report)}
                    disabled={!post}
                    className="inline-flex items-center gap-1 rounded-sm border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                    Remove post
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminReportsTable;
