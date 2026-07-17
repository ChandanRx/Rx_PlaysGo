"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { Input } from "../ui/FormControls";
import AvatarPicker from "../profile/AvatarPicker";
import { signUp } from "../../shared/authSession";
import { DOODLE_AVATARS, avatarsForGender } from "../../shared/doodleAvatars";
import { slideInLeft, slideInRight } from "../../shared/motionPresets";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
// Lenient on purpose — demo auth. Digits with optional +, spaces, or dashes.
const MOBILE_PATTERN = /^\+?[\d][\d\s-]{6,14}$/;

const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];

const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">
      {label}
    </span>
    {children}
    {error && <p className="mt-1.5 text-[12px] font-medium text-red-500">{error}</p>}
  </label>
);

/**
 * Shared two-step registration form used by /auth and /signup.
 * Step 1 — account details. Step 2 — about you (gender, mobile), with the
 * avatar pick last. All state lives here; on success the mock session is
 * written and the user lands on the feed.
 */
const SignUpForm = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    mobile: "",
  });
  const [avatar, setAvatar] = useState(DOODLE_AVATARS[0].url);
  const [errors, setErrors] = useState({});

  const setField = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => (p[name] ? { ...p, [name]: undefined } : p));
  };

  // When the gender pick narrows the avatar set, move a now-hidden doodle
  // selection to the first visible one. Uploaded photos are left alone.
  useEffect(() => {
    const pool = avatarsForGender(form.gender);
    const isDoodle = DOODLE_AVATARS.some((a) => a.url === avatar);
    if (isDoodle && !pool.some((a) => a.url === avatar)) {
      setAvatar(pool[0].url);
    }
  }, [form.gender, avatar]);

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const validateStepOne = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStepTwo = () => {
    const next = {};
    if (!form.gender) next.gender = "Pick an option.";
    if (!MOBILE_PATTERN.test(form.mobile.trim())) next.mobile = "Enter a valid mobile number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleContinue = (event) => {
    event.preventDefault();
    if (validateStepOne()) setStep(2);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateStepTwo()) return;
    signUp({
      name: form.name,
      email: form.email,
      image: avatar,
      mobile: form.mobile,
      gender: form.gender,
    });
    router.push("/");
  };

  return (
    <div>
      {/* step indicator */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {[1, 2].map((s) => (
            <span
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                step >= s ? "bg-[var(--brand)]" : "bg-[var(--border-subtle)]"
              }`}
            />
          ))}
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">
          Step {step} of 2
        </p>
      </div>

      {step === 1 ? (
        <m.form
          key="step-1"
          {...slideInLeft}
          onSubmit={handleContinue}
          noValidate
          className="mt-4 space-y-3"
        >
          <Field label="Full name" error={errors.name}>
            <Input
              type="text"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </Field>

          <Field label="Confirm password" error={errors.confirmPassword}>
            <Input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setField("confirmPassword", e.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
          </Field>

          <Button type="submit" variant="yellow" size="lg" className="w-full">
            Continue
            <ArrowRightIcon className="h-4 w-4" strokeWidth={2.25} />
          </Button>
        </m.form>
      ) : (
        <m.form
          key="step-2"
          {...slideInRight}
          onSubmit={handleSubmit}
          noValidate
          className="mt-4 space-y-3"
        >
          <div>
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">
              Gender
            </span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Gender">
              {GENDERS.map((option) => {
                const active = form.gender === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setField("gender", option)}
                    aria-pressed={active}
                    className={`rounded-full px-3.5 py-2 text-[12.5px] font-bold transition ${
                      active
                        ? "bg-[var(--brand)] text-[var(--on-brand)] shadow-[0_2px_8px_rgba(var(--brand-rgb),0.28)]"
                        : "bg-[var(--bg-secondary)] text-[var(--text-body)] hover:bg-[var(--bg-hover)]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {errors.gender && (
              <p className="mt-1.5 text-[12px] font-medium text-red-500">{errors.gender}</p>
            )}
          </div>

          <Field label="Mobile" error={errors.mobile}>
            <Input
              type="tel"
              value={form.mobile}
              onChange={(e) => setField("mobile", e.target.value)}
              placeholder="+91 98765 43210"
              autoComplete="tel"
            />
          </Field>

          {/* avatar last — the fun part once the details are done */}
          <div>
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">
              Profile photo
            </span>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar}
                alt="Selected avatar"
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-[var(--bg-card)]"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] px-3 py-1.5 text-[12px] font-bold text-[var(--text-body)] transition hover:bg-[var(--bg-hover)]"
              >
                <ArrowUpTrayIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </div>

            <p className="mt-2.5 mb-1.5 text-[11px] font-semibold text-[var(--text-faint)]">
              Or pick a ready-made avatar
            </p>
            <AvatarPicker
              compact
              gender={form.gender}
              value={avatar}
              onChange={(picked) => setAvatar(picked.url)}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] px-4 text-[13px] font-bold text-[var(--text-body)] transition hover:bg-[var(--bg-hover)]"
            >
              <ArrowLeftIcon className="h-4 w-4" strokeWidth={2.25} />
              Back
            </button>
            <Button type="submit" variant="yellow" size="lg" className="flex-1">
              Create account
              <ArrowRightIcon className="h-4 w-4" strokeWidth={2.25} />
            </Button>
          </div>
        </m.form>
      )}
    </div>
  );
};

export default SignUpForm;
