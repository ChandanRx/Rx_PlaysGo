"use client";

import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { backdropFade, modalDialog } from "../../shared/motionPresets";
import { Input, Textarea } from "../ui/FormControls";

const FIELD_LABEL = "mb-1.5 block text-[12.5px] font-semibold text-[var(--text-body)]";

const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: profile.name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    city: profile.city || "",
    state: profile.state || "",
    mobile: profile.mobile || "",
  });

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <>
      <m.div
        {...backdropFade}
        className="fixed inset-0 z-[100] bg-[var(--text-heading)]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[101] flex items-end justify-center p-3 sm:items-center sm:p-4" onClick={onClose}>
        <m.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          variants={modalDialog}
          initial="hidden" animate="visible" exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl bg-[var(--bg-card)] shadow-[0_20px_60px_rgba(28,32,18,0.18)] sm:max-w-md"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
            <h2 id="edit-profile-title" className="text-[16px] font-black text-[var(--text-heading)]">Edit profile</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-faint)] transition hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
            >
              <XMarkIcon className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>

          <form id="edit-profile-form" onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <div>
              <label className={FIELD_LABEL}>Name</label>
              <Input name="name" value={form.name} onChange={onChange} required />
            </div>
            <div>
              <label className={FIELD_LABEL}>Username</label>
              <Input name="username" value={form.username} onChange={onChange} />
            </div>
            <div>
              <label className={FIELD_LABEL}>Bio</label>
              <Textarea name="bio" value={form.bio} onChange={onChange} className="min-h-[76px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={FIELD_LABEL}>City</label>
                <Input name="city" value={form.city} onChange={onChange} />
              </div>
              <div>
                <label className={FIELD_LABEL}>State</label>
                <Input name="state" value={form.state} onChange={onChange} />
              </div>
            </div>

            {/* contact info — private, never shown on the public header */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3.5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--text-faint)]">
                Contact info · private
              </p>
              <div className="space-y-3">
                <div>
                  <label className={FIELD_LABEL}>Mobile</label>
                  <Input name="mobile" value={form.mobile} onChange={onChange} />
                </div>
                <div>
                  <label className={FIELD_LABEL}>Email</label>
                  <Input value={profile.email} disabled />
                </div>
              </div>
            </div>
          </form>

          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[var(--border-subtle)] px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-[13px] font-semibold text-[var(--text-muted)] transition hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-profile-form"
              className="rounded-xl bg-[var(--brand)] px-5 py-2 text-[13px] font-bold text-[var(--on-brand)] shadow-[0_4px_12px_rgba(var(--brand-rgb),0.28)] transition hover:bg-[var(--brand-hover)]"
            >
              Save changes
            </button>
          </div>
        </m.div>
      </div>
    </>
  );
};

export default EditProfileModal;
