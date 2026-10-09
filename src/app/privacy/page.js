"use client";

import { useRouter } from "next/navigation";
import {
  ShieldCheckIcon,
  InformationCircleIcon,
  CircleStackIcon,
  ShareIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const LAST_UPDATED = "July 29, 2026";

const sections = [
  {
    icon: InformationCircleIcon,
    title: "Information we collect",
    points: [
      "Profile details you provide — such as your name, chosen avatar, and community area.",
      "Content you post — the games, requests, and listings you share on the feed.",
      "Basic usage signals — the filters and preferences you set so the app can remember them.",
    ],
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "How we use your information",
    points: [
      "To show you relevant nearby posts and personalise your feed.",
      "To let other members contact you about the posts you create.",
      "To remember your appearance, notification, and feed preferences between visits.",
    ],
  },
  {
    icon: CircleStackIcon,
    title: "Local storage & cookies",
    points: [
      "PlaysGo stores your theme, category, and preferences in your browser's local storage — this stays on your device.",
      "We do not use third-party advertising or tracking cookies.",
      "Clearing your browser storage will reset these preferences.",
    ],
  },
  {
    icon: ShareIcon,
    title: "Sharing your information",
    points: [
      "Posts and profile details you publish are visible to other members of the community.",
      "We do not sell your personal information.",
      "We only share data with service providers needed to run the app, or when required by law.",
    ],
  },
  {
    icon: ClockIcon,
    title: "Data retention",
    points: [
      "Your posts and profile remain until you remove them or delete your account.",
      "Preferences kept in local storage last until you clear them.",
    ],
  },
  {
    icon: ShieldCheckIcon,
    title: "Your choices & rights",
    points: [
      "You can update your profile and preferences any time from Settings.",
      "You can request access to, correction of, or deletion of your personal data.",
      "You can opt out of non-essential notifications from the notification settings.",
    ],
  },
];

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center px-5 sm:px-8">

          {/* Back button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-heading)]"
          >
            <ArrowLeftIcon className="h-[15px] w-[15px]" strokeWidth={2.3} />
            Back
          </button>

          {/* Centred brand */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-soft)]">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-[var(--brand)]" strokeWidth={2.2} />
            </span>
            <span className="text-[14px] font-black tracking-tight text-[var(--text-heading)]">PlaysGo</span>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-[1400px] px-5 pb-14 pt-8 sm:px-8 sm:pt-10 lg:px-8">

        {/* Hero card */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-7 py-8 sm:px-10 sm:py-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-soft)]">
              <ShieldCheckIcon className="h-[18px] w-[18px] text-[var(--brand)]" strokeWidth={2} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
              Privacy Policy
            </span>
          </div>

          <h1 className="mt-4 text-[26px] font-black leading-tight text-[var(--text-heading)] sm:text-[32px]">
            Your privacy matters to us
          </h1>

          <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-[var(--text-body)]">
            This policy explains what information PlaysGo collects, how we use it, and the choices you
            have. We keep things simple and only collect what we need to run your local community feed.
          </p>

          <p className="mt-5 text-[12.5px] font-semibold text-[var(--text-muted)]">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Sections grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {sections.map(({ icon: Icon, title, points }) => (
            <div
              key={title}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-6 sm:px-7 sm:py-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)]">
                  <Icon className="h-[17px] w-[17px] text-[var(--brand)]" strokeWidth={2} />
                </span>
                <h2 className="text-[15px] font-black text-[var(--text-heading)]">{title}</h2>
              </div>

              <ul className="mt-4 space-y-3">
                {points.map((point) => (
                  <li key={point} className="flex gap-3 text-[13.5px] leading-relaxed text-[var(--text-body)]">
                    <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Changes + contact */}
        <div className="mt-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-7 py-7 sm:px-10 sm:py-8">
          <h2 className="text-[17px] font-black text-[var(--text-heading)]">Changes to this policy</h2>
          <p className="mt-2.5 max-w-3xl text-[13.5px] leading-relaxed text-[var(--text-body)]">
            We may update this policy as PlaysGo grows. When we make significant changes, we&apos;ll
            update the date above and, where appropriate, let you know in the app.
          </p>

          <div className="mt-5 flex items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-5 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)]">
              <EnvelopeIcon className="h-[18px] w-[18px] text-[var(--brand)]" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-bold text-[var(--text-heading)]">
                Questions about your privacy?
              </p>
              <p className="mt-0.5 text-[12.5px] text-[var(--text-muted)]">
                Reach us at{" "}
                <a
                  href="mailto:privacy@playsgo.app"
                  className="font-semibold text-[var(--brand)] hover:underline"
                >
                  privacy@playsgo.app
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[12px] text-[var(--text-faint)]">
          © {new Date().getFullYear()} PlaysGo. All rights reserved.
        </p>
      </main>
    </div>
  );
}
