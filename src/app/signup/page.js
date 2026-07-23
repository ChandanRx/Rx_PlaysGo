"use client";

import React from "react";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import PlaysGoLogo from "../../components/PlaysGoLogo";
import FloatingOrbs from "../../components/FloatingOrbs";
import SignUpForm from "../../components/auth/SignUpForm";
import styles from "./signup.module.css";

const HERO_BENEFITS = [
  "Post opportunities, items & events in minutes",
  "Connect with verified locals near you",
  "Chat, follow, and grow your community circle",
];

const SignUpPage = () => {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Hero panel (left) */}
      <aside className="hero-animated-gradient relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Ambient, cursor-reactive background orbs */}
        <FloatingOrbs />

        <div className="relative z-10">
          <PlaysGoLogo variant="light" />
        </div>

        <div className="relative z-10">
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

        <p className="relative z-10 max-w-sm text-[13px] italic leading-relaxed text-white/70">
          "Found weekend cricket, a maths tutor, and sold my old bike — all from
          one app."
        </p>
      </aside>

      {/* Form (right) */}
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
        {/* Floating color orbs */}
        <div className={`${styles.formBg} pointer-events-none absolute inset-0`}>
          <div className={`${styles.orb} ${styles.orb1}`} />
          <div className={`${styles.orb} ${styles.orb2}`} />
          <div className={`${styles.orb} ${styles.orb3}`} />
        </div>

        <div className="relative z-10 w-full max-w-sm">
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

          <SignUpForm />

          <p className="mt-6 text-center text-[11.5px] text-[var(--text-faint)]">
            Demo mode — no real authentication yet; your session lives in this browser.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
