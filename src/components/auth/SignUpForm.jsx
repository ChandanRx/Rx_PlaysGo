"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { Input } from "../ui/FormControls";
import AvatarPicker from "../profile/AvatarPicker";
import { signUp } from "../../shared/authSession";
import { DOODLE_AVATARS, avatarsForGender } from "../../shared/doodleAvatars";
import { slideInLeft, slideInRight } from "../../shared/motionPresets";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const MOBILE_PATTERN = /^\+?[\d][\d\s-]{6,14}$/;

const GENDERS = ["Female", "Male", "Prefer not to say"];

const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">
      {label}
    </span>
    {children}
    {error && <p className="mt-1.5 text-[12px] font-medium text-red-500">{error}</p>}
  </label>
);

const SignUpForm = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    mobile: "",
  });
  const [avatar, setAvatar] = useState(DOODLE_AVATARS[0].url);
  const [agreed, setAgreed] = useState({ terms: false, privacy: false, age: false });
  const [errors, setErrors] = useState({});

  const setField = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => (p[name] ? { ...p, [name]: undefined } : p));
  };

  const toggleAgreed = (key) => {
    setAgreed((p) => ({ ...p, [key]: !p[key] }));
    setErrors((p) => (p.agreed ? { ...p, agreed: undefined } : p));
  };

  useEffect(() => {
    const pool = avatarsForGender(form.gender);
    const isDoodle = DOODLE_AVATARS.some((a) => a.url === avatar);
    if (isDoodle && !pool.some((a) => a.url === avatar)) {
      setAvatar(pool[0].url);
    }
  }, [form.gender, avatar]);

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
    if (!agreed.terms || !agreed.privacy || !agreed.age) {
      next.agreed = "Please accept all terms to continue.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validateStepOne()) setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStepTwo()) return;
    signUp({ name: form.name, email: form.email, image: avatar, mobile: form.mobile, gender: form.gender });
    router.push("/");
  };

  return (
    <div>
      {/* Step indicator */}
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
        /* ── Step 1: Account details ── */
        <m.form key="step-1" {...slideInLeft} onSubmit={handleContinue} noValidate className="mt-4 space-y-3">
          <Field label="Full name" error={errors.name}>
            <Input type="text" value={form.name} onChange={(e) => setField("name", e.target.value)}
              placeholder="Your full name" autoComplete="name" />
          </Field>

          <Field label="Email" error={errors.email}>
            <Input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)}
              placeholder="you@example.com" autoComplete="email" />
          </Field>

          <Field label="Password" error={errors.password}>
            <Input type="password" value={form.password} onChange={(e) => setField("password", e.target.value)}
              placeholder="At least 6 characters" autoComplete="new-password" />
          </Field>

          <Field label="Confirm password" error={errors.confirmPassword}>
            <Input type="password" value={form.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)}
              placeholder="Repeat your password" autoComplete="new-password" />
          </Field>

          <Button type="submit" variant="yellow" size="lg" className="w-full">
            Continue
            <ArrowRightIcon className="h-4 w-4" strokeWidth={2.25} />
          </Button>
        </m.form>
      ) : (
        /* ── Step 2: Profile + agreements ── */
        <m.form key="step-2" {...slideInRight} onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">

          {/* Mobile */}
          <Field label="Mobile number" error={errors.mobile}>
            <Input type="tel" value={form.mobile} onChange={(e) => setField("mobile", e.target.value)}
              placeholder="+91 98765 43210" autoComplete="tel" />
          </Field>

          {/* Gender */}
          <div>
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">
              Gender
            </span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Gender">
              {GENDERS.map((option) => {
                const active = form.gender === option;
                return (
                  <button key={option} type="button" onClick={() => setField("gender", option)}
                    className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                      active
                        ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--on-brand)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-body)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    }`}>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Avatar */}
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">
              Pick an avatar
            </p>
            <AvatarPicker compact gender={form.gender} value={avatar} onChange={(picked) => setAvatar(picked.url)} />
          </div>

          {/* Terms, Privacy & Age */}
          <div className="space-y-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">
              Before you continue
            </p>

            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={agreed.terms} onChange={() => toggleAgreed("terms")}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]" />
              <span className="text-[12.5px] leading-snug text-[var(--text-body)]">
                I agree to the{" "}
                <Link href="/privacy" target="_blank"
                  className="font-semibold text-[var(--brand)] underline underline-offset-2 hover:text-[var(--brand-hover)]">
                  Terms of Service
                </Link>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={agreed.privacy} onChange={() => toggleAgreed("privacy")}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]" />
              <span className="text-[12.5px] leading-snug text-[var(--text-body)]">
                I have read and accept the{" "}
                <Link href="/privacy" target="_blank"
                  className="font-semibold text-[var(--brand)] underline underline-offset-2 hover:text-[var(--brand-hover)]">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={agreed.age} onChange={() => toggleAgreed("age")}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]" />
              <span className="text-[12.5px] leading-snug text-[var(--text-body)]">
                I confirm I am at least <span className="font-semibold">13 years old</span>
              </span>
            </label>

            {errors.agreed && (
              <p className="text-[12px] font-medium text-red-500">{errors.agreed}</p>
            )}
          </div>

          {/* Back / Submit */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] px-4 text-[13px] font-bold text-[var(--text-body)] transition hover:bg-[var(--bg-hover)]">
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
