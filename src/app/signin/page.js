"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheckIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/FormControls";
import PlaysGoLogo from "../../components/PlaysGoLogo";
import { signIn } from "../../shared/authSession";

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

const HERO_STATS = [
  { value: "12k+", label: "Neighbors" },
  { value: "80+", label: "Areas" },
  { value: "4.9★", label: "Avg rating" },
];

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="#4285F4"
      d="M23.52 12.27c0-.82-.07-1.6-.21-2.36H12v4.47h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.73Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.08 7.94-2.9l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6v-3.1H1.28a12 12 0 0 0 0 10.8l4.01-3.1Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.43-3.43C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.28 6.6l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75Z"
    />
  </svg>
);

const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [asAdmin, setAsAdmin] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    signIn({ email, asAdmin });
    router.push(searchParams.get("next") || (asAdmin ? "/dashboard" : "/"));
  };

  const handleGoogleSignIn = () => {
    // Demo mode — no real OAuth yet; mock a Google-authenticated member.
    signIn({ email: "member@gmail.com", name: "Google Member" });
    router.push(searchParams.get("next") || "/");
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* ── Hero panel (left) ── */}
      <aside className="relative hidden overflow-hidden bg-[var(--brand)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[var(--secondary)]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-[var(--accent)]/25 blur-3xl" />

        <PlaysGoLogo variant="light" />

        <div className="relative">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/60">
            Welcome back
          </p>
          <h2 className="mt-3 max-w-sm text-[34px] font-black leading-[1.1] tracking-tight text-white">
            Your neighborhood is waiting for you.
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/70">
            Pick up right where you left off — your posts, chats, and local
            connections are all here.
          </p>
        </div>

        <div className="relative flex gap-8">
          {HERO_STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-[26px] font-black leading-none text-white">{value}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
                {label}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Form (right) ── */}
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <PlaysGoLogo />
          </div>

          <h1 className="text-[26px] font-black text-[var(--text-heading)]">Sign in</h1>
          <p className="mt-1.5 text-[13.5px] text-[var(--text-muted)]">
            New to PlaysGo?{" "}
            <Link
              href="/signup"
              className="font-bold text-[var(--brand)] transition hover:text-[var(--brand-hover)]"
            >
              Create an account
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
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
                placeholder="Your password"
                autoComplete="current-password"
              />
            </Field>

            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-[var(--bg-secondary)] px-3.5 py-2.5">
              <input
                type="checkbox"
                checked={asAdmin}
                onChange={(e) => setAsAdmin(e.target.checked)}
                className="h-4 w-4 accent-[var(--brand)]"
              />
              <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--text-body)]">
                <ShieldCheckIcon className="h-4 w-4 text-[var(--text-muted)]" strokeWidth={2} />
                Sign in as admin (demo)
              </span>
            </label>

            <Button type="submit" variant="yellow" size="lg" className="w-full">
              Sign in
              <ArrowRightIcon className="h-4 w-4" strokeWidth={2.25} />
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">
              or
            </span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] px-4 py-3 text-[14px] font-bold text-[var(--text-body)] transition hover:bg-[var(--bg-hover)]"
          >
            <GoogleIcon className="h-5 w-5" />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-[11.5px] text-[var(--text-faint)]">
            Demo mode — no real authentication yet; any credentials work.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
