"use client";

import React from "react";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/solid";
import { getGenderAvatar } from "../../shared/doodleAvatars";

/**
 * A portrait "bust" — the avatar face as a circle, sitting into a rounded
 * shoulder shape underneath so it reads as a small figure rather than a
 * bare headshot. The shoulder shape is a plain glass tint (not a per-avatar
 * skin/shirt colour), which keeps it looking right against any face.
 */
const AvatarBust = ({ src, alt, size = "md" }) => {
  const dims =
    size === "lg"
      ? { wrap: "h-32 w-28", body: "h-16", head: "h-24 w-24" }
      : { wrap: "h-28 w-24", body: "h-14", head: "h-20 w-20" };

  return (
    <div className={`relative mb-2.5 flex flex-col items-center justify-end ${dims.wrap}`}>
      <div className={`w-[125%] rounded-t-full border border-white/25 bg-white/15 ${dims.body}`} />
      <div className={`absolute top-0 overflow-hidden rounded-full border-2 border-white/30 bg-white/10 shadow-md ${dims.head}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    </div>
  );
};

/**
 * Decorative "player card" pair for the sign-in / sign-up hero panels —
 * two tilted glass cards showing a local avatar bust, a name, and a status
 * pill, with a floating chat-preview pill between them to suggest the two
 * are messaging each other on mobile. Avatars are the same self-contained
 * SVG data URIs used everywhere else in the app (see doodleAvatars.js) — no
 * network image fetch.
 */
const HeroPlayerCards = () => (
  <div className="relative z-10 my-auto flex items-center justify-center gap-4 py-6">
    {/* Card 1 */}
    <div className="flex w-36 -rotate-3 transform-gpu flex-col items-center rounded-2xl border border-white/20 bg-white/10 p-3.5 shadow-xl backdrop-blur-md transition-transform duration-300 hover:rotate-0">
      <AvatarBust src={getGenderAvatar("male", 1)} alt="Rahul, badminton player" />
      <p className="text-[13px] font-semibold text-white">Rahul M.</p>
      <span className="mt-1 inline-block rounded-full bg-emerald-500/80 px-2 py-0.5 text-[10px] font-medium text-white">
        🏸 Badminton
      </span>
    </div>

    {/* Card 2 — featured */}
    <div className="z-10 flex w-40 rotate-2 transform-gpu flex-col items-center rounded-2xl border border-white/30 bg-white/20 p-4 shadow-2xl backdrop-blur-lg transition-transform duration-300 hover:scale-105">
      <AvatarBust src={getGenderAvatar("female", 0)} alt="Priya, looking for a player" size="lg" />
      <p className="text-[14px] font-bold text-white">Priya S.</p>
      <span className="mt-1 inline-block rounded-full bg-[var(--accent)] px-2.5 py-1 text-[11px] font-bold text-[#3A2A0E] shadow">
        🔥 Looking for 1 player
      </span>
    </div>

    {/* Floating chat preview — implies Rahul and Priya are messaging each other */}
    <div className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 -rotate-3 transform-gpu items-center gap-1.5 rounded-2xl border border-white/40 bg-white px-3 py-2 shadow-xl">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand)]">
        <DevicePhoneMobileIcon className="h-3.5 w-3.5 text-white" />
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] font-bold text-slate-800">Rahul → Priya</span>
        <span className="text-[9.5px] text-slate-500">"Court's free at 6? 🏸"</span>
      </div>
      <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-white/40 bg-white" />
    </div>
  </div>
);

export default HeroPlayerCards;
