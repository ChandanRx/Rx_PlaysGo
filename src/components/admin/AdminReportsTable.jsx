"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FlagIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deletePost, getPostById } from "../../shared/dummyPosts";
import { dismissReport, getReports } from "../../shared/adminStore";
import Dropdown from "../ui/Dropdown";
import { useToast } from "../ui/Toast";
import AdminBarChart from "./AdminBarChart";
import { AdminEmpty, AdminLoading } from "./AdminTableState";

const STATUS_FILTER_OPTIONS = ["All", "Pending", "Dismissed"];

const AdminReportsTable = ({ onDataChange }) => {
  const [reports, setReports] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const toast = useToast();

  const refresh = () => setReports(getReports());
  useEffect(() => { refresh(); }, []);

  const handleDismiss = (id) => {
    dismissReport(id);
    refresh();
    onDataChange?.();
    toast.info("Report dismissed");
  };

  const handleRemovePost = (report) => {
    deletePost(report.postId);
    dismissReport(report.id);
    refresh();
    onDataChange?.();
    toast.danger("Post removed");
  };

  // Reason breakdown across every report (not the filtered view) so the mix
  // stays a stable overview. Single hue — bars carry their own label + count.
  const reasonData = useMemo(() => {
    const counts = new Map();
    (reports || []).forEach((r) => counts.set(r.reason, (counts.get(r.reason) || 0) + 1));
    return Array.from(counts, ([label, value]) => ({ label, value, color: "var(--brand)" }))
      .sort((a, b) => b.value - a.value);
  }, [reports]);

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
  const visible = reports.filter((r) => statusFilter === "All" || r.status === statusFilter);
  // Pending reports first — they're the ones needing action.
  const sorted = [...visible].sort((a, b) => (a.status === "Pending" ? 0 : 1) - (b.status === "Pending" ? 0 : 1));

  return (
    <div>
      {/* reason breakdown */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3.5">
        <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
          Reports by reason
        </p>
        <AdminBarChart data={reasonData} ariaLabel="Reports by reason" />
      </div>

      {/* summary + status filter */}
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11.5px] font-medium text-[var(--text-faint)]">
          {pending.length === 0
            ? "All reports handled — nothing pending."
            : `${pending.length} pending report${pending.length === 1 ? "" : "s"} need${pending.length === 1 ? "s" : ""} review`}
        </p>
        <Dropdown
          variant="field"
          options={STATUS_FILTER_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          className="shrink-0 sm:w-[150px]"
          buttonClassName="border border-[var(--border-subtle)] bg-[var(--bg-card)] py-2 text-[12.5px] font-semibold"
        />
      </div>

      {sorted.length === 0 ? (
        <p className="mt-6 py-6 text-center text-[12.5px] text-[var(--text-muted)]">
          No {statusFilter.toLowerCase()} reports.
        </p>
      ) : (
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
                      ? "bg-[var(--warning-soft)] text-[var(--warning)]"
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
      )}
    </div>
  );
};

export default AdminReportsTable;
