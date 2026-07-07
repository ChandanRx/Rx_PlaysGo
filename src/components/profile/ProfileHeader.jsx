"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Pencil, Plus, Settings as SettingsIcon } from "lucide-react";
import Card from "../ui/Card";

const ProfileHeader = ({ profile, onEditProfile }) => {
  const router = useRouter();

  return (
    <Card className="overflow-hidden" hover={false} padding={false}>
      {/* gradient banner — inspired by RightSidebar's profile block, fuller here */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--brand-soft)] via-[var(--bg-input)] to-[var(--bg-card)] px-5 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--brand)]/10" />
        <div className="absolute right-14 top-14 h-24 w-24 rounded-full bg-[var(--border-subtle)] opacity-60" />
        <div className="absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-[var(--brand)]/5" />

        <p className="relative text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">User Profile</p>
      </div>

      {/* avatar + info overlapping the banner — `relative` keeps this whole block
          stacked above the banner's positioned decorative circles regardless of DOM order */}
      <div className="relative px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="-mt-12 flex flex-col items-center gap-4 text-center sm:-mt-14 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-6 sm:gap-y-3 sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:shrink-0 sm:flex-row sm:items-end">
            <div className="relative shrink-0">
              <Image
                src={profile.image}
                alt={profile.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-sm border-4 border-[var(--bg-card)] object-cover shadow-md"
              />
              {profile.verified && (
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--bg-card)] bg-[#22C55E] text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              )}
            </div>
            <div className="min-w-0 sm:pb-1">
              <h1 className="text-[22px] font-black leading-tight text-[var(--text-heading)]">{profile.name}</h1>
              <p className="text-[13px] text-[var(--text-muted)]">
                @{profile.username} · {profile.city}, {profile.state}
              </p>
            </div>
          </div>

          {/* quick actions — ml-auto (instead of justify-between on the parent) keeps this
              pinned to the right whether it shares the row with the avatar block or wraps below it */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:ml-auto sm:shrink-0 sm:justify-end sm:pb-1">
            <button
              type="button"
              onClick={onEditProfile}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-2 text-[12.5px] font-semibold text-[var(--text-body)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2.25} />
              Edit profile
            </button>
            <button
              type="button"
              onClick={() => router.push("/createpost")}
              className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--brand)] px-4 py-2 text-[12.5px] font-bold text-white shadow-[0_4px_12px_rgba(255,60,31,0.28)] transition hover:bg-[var(--brand-hover)]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              Create post
            </button>
            <button
              type="button"
              onClick={() => router.push("/settings")}
              aria-label="Settings"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              <SettingsIcon className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {profile.bio && (
          <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-[var(--text-body)] sm:mx-0">
            {profile.bio}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ProfileHeader;
