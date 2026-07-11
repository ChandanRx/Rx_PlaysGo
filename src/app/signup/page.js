"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/FormControls";
import PlaysGoLogo from "../../components/PlaysGoLogo";
import { signUp } from "../../shared/authSession";
import { AVATAR_PRESETS } from "../../shared/avatarPresets";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">
      {label}
    </span>
    {children}
    {error && <p className="mt-1.5 text-[12px] font-medium text-red-500">{error}</p>}
  </label>
);

const HERO_BENEFITS = [
  "Post opportunities, items & events in minutes",
  "Connect with verified locals near you",
  "Chat, follow, and grow your community circle",
];

const SignUpPage = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0].url);
  const [errors, setErrors] = useState({});

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!name.trim()) {
      nextErrors.name = "Enter your name.";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords don't match.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    signUp({ name, email, image: avatar });
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* ── Form (left) ── */}
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <PlaysGoLogo />
          </div>

          <h1 className="text-[26px] font-black text-[var(--text-heading)]">
            Create your account
          </h1>
          <p className="mt-1.5 text-[13.5px] text-[var(--text-muted)]">
            Already a member?{" "}
            <Link
              href="/signin"
              className="font-bold text-[var(--brand)] transition hover:text-[var(--brand-hover)]"
            >
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
            <div>
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">
                Profile photo
              </span>
              <div className="flex items-center gap-4">
                <img
                  src={avatar}
                  alt="Selected avatar"
                  className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-[var(--bg-card)]"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] px-3.5 py-2 text-[13px] font-bold text-[var(--text-body)] transition hover:bg-[var(--bg-hover)]"
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

              <p className="mt-3 mb-1.5 text-[11px] font-semibold text-[var(--text-faint)]">
                Or pick a ready-made avatar
              </p>
              <div className="flex flex-wrap gap-2.5">
                {AVATAR_PRESETS.map((preset) => {
                  const active = avatar === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAvatar(preset.url)}
                      aria-label={`Choose ${preset.id} avatar`}
                      aria-pressed={active}
                      className={`h-10 w-10 overflow-hidden rounded-full transition ${
                        active
                          ? "ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-[var(--bg-card)]"
                          : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img src={preset.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>

            <Field label="Full name" error={errors.name}>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Password" error={errors.password}>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
            </Field>

            <Field label="Confirm password" error={errors.confirmPassword}>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
              />
            </Field>

            <Button type="submit" variant="yellow" size="lg" className="w-full">
              Create account
              <ArrowRightIcon className="h-4 w-4" strokeWidth={2.25} />
            </Button>
          </form>

          <p className="mt-6 text-center text-[11.5px] text-[var(--text-faint)]">
            Demo mode — no real authentication yet; your session lives in this browser.
          </p>
        </div>
      </main>

      {/* ── Hero panel (right) ── */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[var(--secondary)] via-[var(--brand-hover)] to-[var(--brand)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-16 -top-10 h-72 w-72 rounded-full bg-[var(--accent)]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-[var(--brand)]/50 blur-3xl" />

        <div className="relative flex justify-end">
          <PlaysGoLogo variant="light" />
        </div>

        <div className="relative">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/60">
            Join PlaysGo
          </p>
          <h2 className="mt-3 max-w-sm text-[34px] font-black leading-[1.1] tracking-tight text-white">
            Everything local, in one place.
          </h2>

          <ul className="mt-7 space-y-3.5">
            {HERO_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-[14px] text-white/85">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative max-w-sm text-[13px] italic leading-relaxed text-white/70">
          “Found weekend cricket, a maths tutor, and sold my old bike — all from
          one app.”
        </p>
      </aside>
    </div>
  );
};

export default SignUpPage;
