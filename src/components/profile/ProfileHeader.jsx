"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { CheckBadgeIcon, BoltIcon } from "@heroicons/react/24/solid";
import {
  CameraIcon,
  CheckIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  ShareIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Card from "../ui/Card";
import CoverPicker from "./CoverPicker";
import { coverForUser } from "../../shared/coverPhotos";

const actionBase =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-bold transition active:scale-[0.97] sm:px-5";

const ProfileHeader = ({
  profile,
  stats = [],
  isOwnProfile = true,
  onEditProfile,
  onChangeCover,
  following = false,
  onToggleFollow,
  onGetInTouch,
}) => {
  const [shareCopied, setShareCopied] = useState(false);
  const [pickingCover, setPickingCover] = useState(false);
  const location = [profile.city, profile.state].filter(Boolean).join(", ");
  const cover = coverForUser(profile);

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
      {/* ── Cover photo banner ── */}
      <div className="relative h-28 overflow-hidden bg-[var(--bg-secondary)] sm:h-36">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Fade the banner into the card so the avatar reads cleanly. */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[var(--bg-card)]/60 to-transparent" />

        {/* Change-cover control — own profile only. */}
        {isOwnProfile && (
          <button
            type="button"
            onClick={() => setPickingCover(true)}
            aria-label="Change cover photo"
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur-sm transition hover:bg-black/50 active:scale-95 sm:right-4 sm:top-4"
          >
            <CameraIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
            <span className="hidden sm:inline">Change cover</span>
          </button>
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
              className={`${actionBase} bg-[var(--brand)] text-[var(--on-brand)] shadow-[0_2px_10px_rgba(var(--brand-rgb),0.28)] hover:bg-[var(--brand-hover)]`}
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
                    : "bg-[var(--text-heading)] text-[var(--bg-card)] shadow-sm hover:opacity-90"
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

      <AnimatePresence>
        {pickingCover && (
          <CoverPicker
            value={profile.coverImage}
            onSelect={(url) => onChangeCover?.(url)}
            onClose={() => setPickingCover(false)}
          />
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ProfileHeader;
