"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../../components/ui/Card";
import AvatarPicker from "../../components/profile/AvatarPicker";
import {
  BellIcon,
  CheckBadgeIcon,
  MapPinIcon,
  MoonIcon,
  Squares2X2Icon,
  SunIcon,
} from "@heroicons/react/24/outline";
import {
  CURRENT_USER_ID,
  getStoredUserProfile,
  getUserById,
  updateUserProfile,
} from "../../shared/dummyPosts";
import { getStoredSession } from "../../shared/authSession";

const STORAGE_KEY = "quibly_theme";
const PREFS_KEY = "playsgo_prefs";

const DEFAULT_PREFS = {
  matchReminders: true,
  newMessages: true,
  communityUpdates: false,
  autoplayMedia: true,
  compactFeed: false,
  nearbyOnly: true,
};

// ── Small sliding on/off switch used by the preference rows ──
const Switch = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${
      checked ? "bg-[var(--brand)]" : "bg-[var(--bg-hover)]"
    }`}
  >
    <span
      className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

const PrefRow = ({ title, description, checked, onChange, last }) => (
  <div
    className={`flex items-center justify-between gap-4 py-3.5 ${
      last ? "" : "border-b border-[var(--border-subtle)]"
    }`}
  >
    <div className="min-w-0">
      <p className="text-[14px] font-semibold text-[var(--text-heading)]">{title}</p>
      <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--text-muted)]">{description}</p>
    </div>
    <Switch checked={checked} onChange={onChange} label={title} />
  </div>
);

const SettingsPage = () => {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [avatar, setAvatar] = useState("");
  const [gender, setGender] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    const resolved = saved === "dark" ? "dark" : saved === "light" ? "light" :
      (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(resolved);

    try {
      const storedPrefs = window.localStorage.getItem(PREFS_KEY);
      if (storedPrefs) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(storedPrefs) });
    } catch {
      /* ignore malformed prefs */
    }

    const me = getUserById(CURRENT_USER_ID) || getStoredUserProfile();
    setAvatar(me.image || "");
    // Prefer the profile's gender; fall back to what sign-up stored.
    setGender(me.gender || getStoredSession()?.gender || "");

    setMounted(true);
  }, []);

  // Persist the chosen avatar the same way EditProfileModal saves the profile.
  const handleSelectAvatar = (nextAvatar) => {
    setAvatar(nextAvatar.url);
    updateUserProfile({ image: nextAvatar.url });
  };

  const applyTheme = (t) => {
    document.documentElement.dataset.theme = t;
    document.body.dataset.theme = t;
    window.localStorage.setItem(STORAGE_KEY, t);
    setTheme(t);
  };

  const togglePref = (key) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="space-y-5">

      {/* header card */}
      <Card className="p-5 md:p-6" hover={false}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)]">Settings</p>
        <h1 className="mt-1.5 text-[22px] font-black text-[var(--text-heading)]">Preferences</h1>
        <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-[var(--text-muted)]">
          PlaysGo is your sports community — manage how the app looks and behaves below.
        </p>
      </Card>

      {/* ── Appearance — segmented theme switch ── */}
      <Card className="p-5 md:p-6" hover={false}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)]">Appearance</p>
        <div className="mt-1.5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[18px] font-black text-[var(--text-heading)]">Theme</h2>
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">Switch between a light or dark look.</p>
          </div>

          {mounted && (
            <div className="relative inline-flex w-full max-w-[220px] rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-1 sm:w-auto">
              {/* sliding indicator */}
              <span
                className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-[var(--brand)] shadow-[0_2px_8px_rgba(var(--brand-rgb),0.28)] transition-transform duration-300 ease-out"
                style={{ transform: theme === "dark" ? "translateX(100%)" : "translateX(0)" }}
              />
              <button
                type="button"
                onClick={() => applyTheme("light")}
                className={`relative z-10 inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-bold transition-colors sm:flex-none ${
                  theme === "light" ? "text-[var(--on-brand)]" : "text-[var(--text-muted)]"
                }`}
              >
                <SunIcon className="h-4 w-4" strokeWidth={2.25} />
                Light
              </button>
              <button
                type="button"
                onClick={() => applyTheme("dark")}
                className={`relative z-10 inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-bold transition-colors sm:flex-none ${
                  theme === "dark" ? "text-[var(--on-brand)]" : "text-[var(--text-muted)]"
                }`}
              >
                <MoonIcon className="h-4 w-4" strokeWidth={2.25} />
                Dark
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* ── Avatar picker ── */}
      <Card className="p-5 md:p-6" hover={false}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
              <CheckBadgeIcon className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)]">Avatar</p>
              <h2 className="text-[16px] font-black text-[var(--text-heading)]">Pick your look</h2>
            </div>
          </div>

          {mounted && avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt="Your current avatar"
              className="h-12 w-12 shrink-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-1"
            />
          )}
        </div>

        <p className="mt-2.5 max-w-xl text-[13px] leading-relaxed text-[var(--text-muted)]">
          Choose an illustrated avatar for your profile. Your pick saves instantly.
        </p>

        {mounted && (
          <div className="mt-4">
            <AvatarPicker gender={gender} value={avatar} onChange={handleSelectAvatar} />
          </div>
        )}
      </Card>

      {/* ── Notifications ── */}
      <Card className="p-5 md:p-6" hover={false}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
            <BellIcon className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)]">Notifications</p>
            <h2 className="text-[16px] font-black text-[var(--text-heading)]">Stay in the loop</h2>
          </div>
        </div>

        {mounted && (
          <div className="mt-2">
            <PrefRow
              title="Match reminders"
              description="Get a nudge before games and events you've joined."
              checked={prefs.matchReminders}
              onChange={() => togglePref("matchReminders")}
            />
            <PrefRow
              title="New messages"
              description="Alerts when a player or organiser messages you."
              checked={prefs.newMessages}
              onChange={() => togglePref("newMessages")}
            />
            <PrefRow
              title="Community updates"
              description="Occasional news and highlights from your area."
              checked={prefs.communityUpdates}
              onChange={() => togglePref("communityUpdates")}
              last
            />
          </div>
        )}
      </Card>

      {/* ── Feed preferences ── */}
      <Card className="p-5 md:p-6" hover={false}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
            <Squares2X2Icon className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)]">Feed</p>
            <h2 className="text-[16px] font-black text-[var(--text-heading)]">Feed preferences</h2>
          </div>
        </div>

        {mounted && (
          <div className="mt-2">
            <PrefRow
              title="Autoplay media"
              description="Play images and clips as you scroll the feed."
              checked={prefs.autoplayMedia}
              onChange={() => togglePref("autoplayMedia")}
            />
            <PrefRow
              title="Compact layout"
              description="Show more posts per screen with tighter spacing."
              checked={prefs.compactFeed}
              onChange={() => togglePref("compactFeed")}
            />
            <PrefRow
              title="Nearby only"
              description="Prioritise posts from around your community."
              checked={prefs.nearbyOnly}
              onChange={() => togglePref("nearbyOnly")}
              last
            />
          </div>
        )}
      </Card>

      {/* ── Location ── */}
      <Card className="p-5 md:p-6" hover={false}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)]">Location</p>
        <div className="mt-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
              <MapPinIcon className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <p className="text-[14px] font-bold text-[var(--text-heading)]">Mumbai community</p>
              <p className="text-[12.5px] text-[var(--text-muted)]">Your feed is centred on this area.</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-[12px] font-semibold text-[var(--text-heading)]">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            Active
          </span>
        </div>
      </Card>

      {/* footer */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="text-[12px] font-semibold text-[var(--text-faint)] transition hover:text-[var(--brand)]"
        >
          Admin dashboard
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
