"use client";

import React, { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { backdropFade, modalDialog } from "../../shared/motionPresets";
import { Input, Textarea } from "../ui/FormControls";
import AvatarPicker from "./AvatarPicker";

const FIELD_LABEL = "mb-1.5 block text-[12.5px] font-semibold text-[var(--text-body)]";
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB — keeps the data URL in localStorage sane.

const EditProfileModal = ({ profile, onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: profile.name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    city: profile.city || "",
    state: profile.state || "",
    mobile: profile.mobile || "",
    image: profile.image || "",
  });
  const [errors, setErrors] = useState({});

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

  const setField = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => (p[name] ? { ...p, [name]: undefined } : p));
  };

  const onChange = (e) => setField(e.target.name, e.target.value);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, image: "Please choose an image file." }));
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setErrors((p) => ({ ...p, image: "Image must be under 2 MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setField("image", reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next = {};
    const name = form.name.trim();
    const username = form.username.trim();

    if (!name) next.name = "Name is required.";
    if (!username) next.username = "Username is required.";
    else if (/\s/.test(username)) next.username = "Username can't contain spaces.";
    else if (!/^[a-zA-Z0-9._]+$/.test(username))
      next.username = "Use only letters, numbers, dots or underscores.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      name: form.name.trim(),
      username: form.username.trim().toLowerCase(),
    });
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

          <form id="edit-profile-form" onSubmit={handleSubmit} noValidate className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {/* Profile photo — upload or pick a ready-made avatar */}
            <div>
              <span className={FIELD_LABEL}>Profile photo</span>
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image}
                  alt="Selected avatar"
                  className="h-16 w-16 shrink-0 rounded-full border border-[var(--border-subtle)] object-cover ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-[var(--bg-card)]"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] px-3.5 py-2 text-[13px] font-bold text-[var(--text-body)] transition hover:bg-[var(--bg-input)]"
                >
                  <ArrowUpTrayIcon className="h-4 w-4" strokeWidth={2.25} />
                  Upload photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </div>
              {errors.image && (
                <p className="mt-2 text-[12px] font-semibold text-[var(--danger)]">{errors.image}</p>
              )}

              <p className="mt-3 mb-1.5 text-[11px] font-semibold text-[var(--text-faint)]">
                Or pick a ready-made avatar
              </p>
              <AvatarPicker
                compact
                gender={profile.gender}
                value={form.image}
                onChange={(picked) => setField("image", picked.url)}
              />
            </div>

            <div>
              <label className={FIELD_LABEL}>Name</label>
              <Input name="name" value={form.name} onChange={onChange} aria-invalid={!!errors.name} />
              {errors.name && (
                <p className="mt-1.5 text-[12px] font-semibold text-[var(--danger)]">{errors.name}</p>
              )}
            </div>
            <div>
              <label className={FIELD_LABEL}>Username</label>
              <Input name="username" value={form.username} onChange={onChange} aria-invalid={!!errors.username} />
              {errors.username && (
                <p className="mt-1.5 text-[12px] font-semibold text-[var(--danger)]">{errors.username}</p>
              )}
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
