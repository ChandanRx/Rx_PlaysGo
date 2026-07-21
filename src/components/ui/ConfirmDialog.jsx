"use client";

import React from "react";
import { m } from "framer-motion";
import { backdropFade, modalDialog } from "../../shared/motionPresets";

/**
 * Shared confirm dialog — render inside <AnimatePresence> so exit
 * animations run. Uses the central backdrop + dialog motion presets.
 */
const ConfirmDialog = ({
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onCancel,
  onConfirm,
}) => (
  <>
    <m.div
      {...backdropFade}
      className="fixed inset-0 z-[100] bg-[var(--text-heading)]/40 backdrop-blur-sm"
      onClick={onCancel}
    />
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4" onClick={onCancel}>
      <m.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        variants={modalDialog}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-[var(--bg-card)] p-5 shadow-[0_20px_60px_rgba(28,32,18,0.18)]"
      >
        <h3 id="confirm-dialog-title" className="text-[16px] font-black text-[var(--text-heading)]">
          {title}
        </h3>
        <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-[13px] font-semibold text-[var(--text-muted)] transition hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl border border-[var(--danger-border)] bg-[var(--danger-soft)] px-4 py-2 text-[13px] font-semibold text-[var(--danger)] transition hover:bg-[var(--danger-border)]"
          >
            {confirmLabel}
          </button>
        </div>
      </m.div>
    </div>
  </>
);

export default ConfirmDialog;
