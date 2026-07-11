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
  SparklesIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Card from "../ui/Card";

const actionBase =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-bold transition active:scale-[0.97] sm:px-5";

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
      <div className="relative overflow-hidden bg-[var(--text-heading)] px-5 py-5 text-[var(--selected-fg)] sm:px-6 sm:py-6">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative flex items-start justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/85 backdrop-blur">
            <SparklesIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
            Community profile
          </span>

          {profile.verified && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#18200d]">
              <BoltIcon className="h-3.5 w-3.5" />
              Pro
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="relative -mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-sm)] sm:flex-row sm:items-end sm:p-5">
            <div className="relative mx-auto shrink-0 sm:mx-0">
              <Image
                src={profile.image}
                alt={profile.name}
                width={112}
                height={112}
                className="h-24 w-24 rounded-2xl border-4 border-[var(--bg-card)] bg-[var(--bg-secondary)] object-cover shadow-[var(--shadow-md)] sm:h-28 sm:w-28"
              />
              {profile.verified && (
                <CheckBadgeIcon className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[var(--bg-card)] p-0.5 text-[var(--brand)]" title="Verified" />
              )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex min-w-0 flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="truncate text-[24px] font-black leading-tight text-[var(--text-heading)] sm:text-[28px]">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <span className="rounded-full border border-[var(--brand-border)] bg-[var(--brand-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--brand)]">
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-[var(--text-muted)] sm:justify-start">
                <span className="font-semibold text-[var(--text-body)]">@{profile.username}</span>
                {location && (
                  <>
                    <span aria-hidden="true" className="text-[var(--text-faint)]">/</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPinIcon className="h-3.5 w-3.5 text-[var(--brand)]" strokeWidth={2} />
                      {location}
                    </span>
                  </>
                )}
              </div>

              {profile.bio && (
                <p className="mx-auto mt-3 max-w-2xl text-[13.5px] leading-relaxed text-[var(--text-body)] sm:mx-0">
                  {profile.bio}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
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
                      className={`${actionBase} border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-body)] hover:border-[var(--brand)] hover:text-[var(--brand)]`}
                    >
                      <EnvelopeIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                      Message
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share profile"
                  className={`${actionBase} border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-body)] hover:border-[var(--brand)] hover:text-[var(--brand)]`}
                >
                  {shareCopied ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                      Copied
                    </>
                  ) : (
                    <>
                      <ShareIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                      Share
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-2 sm:gap-3 sm:p-3">
              {stats.map(({ label, value, onClick }) => {
                const interactive = typeof onClick === "function";
                const Tag = interactive ? "button" : "div";
                return (
                  <Tag
                    key={label}
                    type={interactive ? "button" : undefined}
                    onClick={interactive ? onClick : undefined}
                    className={`group min-w-0 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-3 text-center shadow-[var(--shadow-xs)] transition sm:px-3 sm:py-4 ${
                      interactive ? "hover:-translate-y-0.5 hover:border-[var(--brand-border)] hover:shadow-[var(--shadow-sm)]" : ""
                    }`}
                  >
                    <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] sm:text-[11px]">
                      {label}
                    </p>
                    <p className={`mt-1 text-[23px] font-black leading-none text-[var(--text-heading)] sm:text-[28px] ${
                      interactive ? "group-hover:text-[var(--brand)]" : ""
                    }`}>
                      {value}
                    </p>
                  </Tag>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
