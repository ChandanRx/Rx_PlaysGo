"use client";

import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import { CheckIcon, FlagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { addReport, REPORT_REASONS } from "../shared/adminReports";
import { getStoredSession } from "../shared/authSession";
import { backdropFade, modalDialog } from "../shared/motionPresets";
import Button from "./ui/Button";

const DETAILS_MAX = 240;

/**
 * Reason picker for flagging a post. Render inside <AnimatePresence> so the
 * exit animation runs. Writes straight into the mock reports store the admin
 * dashboard reads (shared/adminReports.js).
 */
const ReportPostModal = ({ post, onClose, onReported }) => {
  const [reason, setReason]   = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = () => {
    if (!reason) return;
    const reportedBy = getStoredSession()?.email || "";
    addReport({ postId: post?.id, reason, details, reportedBy });
    onReported?.(reason);
    onClose?.();
  };

  return (
    <>
      <m.div
        {...backdropFade}
        className="fixed inset-0 z-[110] bg-[var(--text-heading)]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[111] flex items-center justify-center p-4" onClick={onClose}>
        <m.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
          variants={modalDialog}
          initial="hidden" animate="visible" exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[85vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-[var(--bg-card)] shadow-[0_20px_60px_rgba(28,32,18,0.18)]"
        >
          {/* header */}
          <div className="flex shrink-0 items-start gap-2.5 border-b border-[var(--border-subtle)] p-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--danger-soft)] text-[var(--danger)]">
              <FlagIcon className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 id="report-modal-title" className="text-[15px] font-black text-[var(--text-heading)]">
                Report this post
              </h3>
              <p className="mt-0.5 truncate text-[12px] text-[var(--text-muted)]">
                {post?.title || "This post"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-faint)] transition hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
            >
              <XMarkIcon className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>

          {/* reasons */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
              Why are you reporting this?
            </p>
            <div role="radiogroup" aria-label="Report reason" className="space-y-1.5">
              {REPORT_REASONS.map((option) => {
                const active = option === reason;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setReason(option)}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-semibold transition ${
                      active
                        ? "border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-body)] hover:border-[var(--border-strong)] hover:text-[var(--text-heading)]"
                    }`}
                  >
                    {option}
                    {active && <CheckIcon className="h-4 w-4 shrink-0" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>

            <label className="mt-4 block">
              <span className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                Add details (optional)
              </span>
              <textarea
                rows={3}
                value={details}
                maxLength={DETAILS_MAX}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Anything the moderators should know?"
                className="mt-1.5 w-full resize-none rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 text-[12.5px] text-[var(--text-body)] outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--border-strong)]"
              />
            </label>
            <p className="mt-1 text-right text-[10.5px] text-[var(--text-faint)]">
              {details.length}/{DETAILS_MAX}
            </p>
          </div>

          {/* footer */}
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[var(--border-subtle)] p-3">
            <Button variant="ghost" size="sm" className="min-h-10" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" className="min-h-10" onClick={handleSubmit} disabled={!reason}>
              <FlagIcon className="h-[14px] w-[14px]" strokeWidth={2.25} />
              Submit report
            </Button>
          </div>
        </m.div>
      </div>
    </>
  );
};

export default ReportPostModal;
