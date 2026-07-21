"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { MapPinIcon, PlusIcon, TrophyIcon, UsersIcon } from "@heroicons/react/24/outline";
import { tapScale } from "../../shared/motionPresets";

const actions = [
  {
    title: "Create Post",
    subtitle: "Find players nearby",
    icon: PlusIcon,
    href: "/createpost",
    iconColor: "var(--brand)",
    iconBg: "var(--brand-soft)",
  },
  {
    title: "Find Players",
    subtitle: "Join active games",
    icon: UsersIcon,
    href: "/posts",
    iconColor: "var(--secondary)",
    iconBg: "var(--secondary-soft)",
  },
  {
    title: "Book Turf",
    subtitle: "Reserve nearby courts",
    icon: MapPinIcon,
    href: "/posts?q=turf",
    iconColor: "var(--accent)",
    iconBg: "var(--accent-soft)",
  },
  {
    title: "Join Match",
    subtitle: "Discover games",
    icon: TrophyIcon,
    href: "/posts",
    iconColor: "var(--success)",
    iconBg: "var(--success-soft)",
  },
];

const QuickActions = () => {
  const router = useRouter();

  return (
    <div className="space-y-3">
      <h2 className="text-[15px] font-extrabold tracking-tight text-[var(--text-heading)]">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ title, subtitle, icon: Icon, href, iconColor, iconBg }) => (
          <m.button
            key={title}
            type="button"
            whileTap={tapScale}
            onClick={() => router.push(href)}
            className="flex h-full flex-col items-start gap-3 rounded-[22px] bg-[var(--bg-card)] p-4 text-left shadow-[0_4px_20px_rgba(28,32,18,0.08)] transition-shadow duration-200 active:shadow-[0_2px_10px_rgba(28,32,18,0.10)]"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ background: iconBg }}
            >
              <Icon className="h-5 w-5" style={{ color: iconColor }} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-[13.5px] font-bold leading-tight text-[var(--text-heading)]">{title}</p>
              <p className="mt-1 text-[11.5px] leading-snug text-[var(--text-muted)]">{subtitle}</p>
            </div>
          </m.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
