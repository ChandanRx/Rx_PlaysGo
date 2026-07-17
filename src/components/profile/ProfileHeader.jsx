"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckBadgeIcon, BoltIcon } from "@heroicons/react/24/solid";
import {
  CheckIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  ShareIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Card from "../ui/Card";
import FloatingOrbs from "../FloatingOrbs";

const actionBase =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-bold transition active:scale-[0.97] sm:px-5";

// Soft, pastel color blobs for the banner — same drifting/parallax treatment as
// the auth hero (<FloatingOrbs />), just lighter pink/purple/blue tints instead
// of the brand green. Semi-transparent + blurred so they read on light or dark.
const BANNER_ORBS = [
  {
    className:
      "absolute -left-10 -top-14 h-52 w-52 rounded-full bg-[#f9a8d4]/70 blur-3xl",
    keyframes: { x: [0, 24, -12, 0], y: [0, 16, -10, 0], scale: [1, 1.1, 0.95, 1] },
    duration: 9,
    parallax: 24,
  },
  {
    className:
      "absolute left-1/3 -top-20 h-60 w-60 rounded-full bg-[#c4b5fd]/70 blur-3xl",
    keyframes: { x: [0, -20, 14, 0], y: [0, 12, -8, 0], scale: [1, 0.96, 1.08, 1] },
    duration: 12,
    parallax: 18,
  },
  {
    className:
      "absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[#93c5fd]/70 blur-3xl",
    keyframes: { x: [0, 18, -14, 0], y: [0, -14, 10, 0], scale: [1, 1.06, 0.94, 1] },
    duration: 10,
    parallax: 22,
  },
];

// Tint cycle for the little circular count pills in the banner corner.
const BADGE_TINTS = [
  "border-[#f9a8d4]/60 bg-[#f9a8d4]/25 text-[#be185d]",
  "border-[#c4b5fd]/60 bg-[#c4b5fd]/25 text-[#6d28d9]",
  "border-[#93c5fd]/60 bg-[#93c5fd]/25 text-[#1d4ed8]",
];

const ProfileHeader = ({
  profile,
  stats = [],
  isOwnProfile = true,
  onEditProfile,
  following = false,
  onToggleFollow,
  onGetInTouch,
}) => {
  const [shareCopied, setShareCopied] = useState(false);
  const location = [profile.city, profile.state].filter(Boolean).join(", ");

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profile/${profile.username}`;
    const shareData = { title: profile.name, text: profile.bio, url: shareUrl };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User dismissed the native share sheet.
      }
      return;
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 1800);
      } catch {
        // Clipboard can be unavailable in insecure contexts.
      }
    }
  };

  return (
    <Card padding={false} hover={false} className="rounded-[28px]">
      {/* ── Soft pastel gradient banner ── */}
      <div className="relative h-28 overflow-hidden bg-[var(--bg-secondary)] sm:h-36">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(249,168,212,.4),rgba(196,181,253,.4)_45%,rgba(147,197,253,.4))]" />
        <FloatingOrbs orbs={BANNER_ORBS} />
        {/* Fade the banner into the card so the avatar reads cleanly. */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[var(--bg-card)]/60 to-transparent" />

        {/* Little colored count pills — secondary, playful stat glance. */}
        {stats.length > 0 && (
          <div className="absolute right-3 top-3 flex gap-1.5 sm:right-4 sm:top-4">
            {stats.slice(0, 3).map((stat, i) => (
              <span
                key={stat.label}
                title={stat.label}
                className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full border px-2 text-[11px] font-black backdrop-blur-sm ${BADGE_TINTS[i % BADGE_TINTS.length]}`}
              >
                {stat.value}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        {/* Avatar overlaps the banner bottom-left; stats sit top-right. */}
        <div className="flex items-start justify-between gap-4">
          <div className="relative -mt-12 shrink-0 sm:-mt-14">
            <Image
              src={profile.image}
              alt={profile.name}
              width={112}
              height={112}
              unoptimized={profile.image?.startsWith("data:")}
              className="h-24 w-24 rounded-full border-4 border-[var(--bg-card)] bg-[var(--bg-secondary)] object-cover shadow-[var(--shadow-md)] sm:h-28 sm:w-28"
            />
            {profile.verified && (
              <CheckBadgeIcon
                className="absolute -bottom-0.5 -right-0.5 h-7 w-7 rounded-full bg-[var(--bg-card)] p-0.5 text-[var(--brand)]"
                title="Verified"
              />
            )}
          </div>

          {stats.length > 0 && (
            <div className="flex items-start gap-5 pt-3 sm:gap-7 sm:pt-4">
              {stats.map(({ label, value, onClick }) => {
                const interactive = typeof onClick === "function";
                const Tag = interactive ? "button" : "div";
                return (
                  <Tag
                    key={label}
                    type={interactive ? "button" : undefined}
                    onClick={interactive ? onClick : undefined}
                    className={`group min-w-0 text-center transition ${
                      interactive ? "cursor-pointer hover:-translate-y-0.5" : "cursor-default"
                    }`}
                  >
                    <span
                      className={`block text-[19px] font-black leading-none text-[var(--text-heading)] sm:text-[22px] ${
                        interactive ? "group-hover:text-[var(--brand)]" : ""
                      }`}
                    >
                      {value}
                    </span>
                    <span
                      className={`mt-1 block text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] sm:text-[11px] ${
                        interactive
                          ? "decoration-[var(--brand)] decoration-2 underline-offset-4 group-hover:text-[var(--brand)] group-hover:underline"
                          : ""
                      }`}
                    >
                      {label}
                    </span>
                  </Tag>
                );
              })}
            </div>
          )}
        </div>

        {/* Name + PRO / verified pill */}
        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <h1 className="text-[22px] font-black leading-tight text-[var(--text-heading)] sm:text-[26px]">
            {profile.name}
          </h1>
          {profile.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#18200d]">
              <BoltIcon className="h-3 w-3" />
              Pro
            </span>
          )}
        </div>

        {/* One-line subtitle: handle + location */}
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-body)]">@{profile.username}</span>
          {location && (
            <>
              <span aria-hidden="true" className="text-[var(--text-faint)]">
                &middot;
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPinIcon className="h-3.5 w-3.5 text-[var(--brand)]" strokeWidth={2} />
                {location}
              </span>
            </>
          )}
        </div>

        {profile.bio && (
          <p className="mt-2 line-clamp-1 max-w-2xl text-[13.5px] leading-relaxed text-[var(--text-body)]">
            {profile.bio}
          </p>
        )}

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {isOwnProfile ? (
            <button
              type="button"
              onClick={onEditProfile}
              className={`${actionBase} bg-[var(--text-heading)] text-[var(--selected-fg)] shadow-sm hover:opacity-90`}
            >
              <PencilIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
              Edit profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onToggleFollow}
                aria-pressed={following}
                className={`${actionBase} ${
                  following
                    ? "border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-body)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    : "bg-[var(--text-heading)] text-[var(--selected-fg)] shadow-sm hover:opacity-90"
                }`}
              >
                {following ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                    Follow
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onGetInTouch}
                className={`${actionBase} border border-[var(--border-subtle)] bg-transparent text-[var(--text-body)] hover:border-[var(--brand)] hover:text-[var(--brand)]`}
              >
                <EnvelopeIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                Get in touch
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share profile"
            className={`${actionBase} border border-[var(--border-subtle)] bg-transparent text-[var(--text-body)] hover:border-[var(--brand)] hover:text-[var(--brand)] !px-3`}
          >
            {shareCopied ? (
              <CheckIcon className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <ShareIcon className="h-4 w-4" strokeWidth={2.25} />
            )}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
