"use client";

import React from "react";
import {
  HiChatAlt2,
  HiCog,
  HiDotsVertical,
  HiHome,
  HiOutlinePlus,
  HiSparkles,
  HiUser,
} from "react-icons/hi";

import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ui/ThemeToggle";
import PlaysGoLogo from "./PlaysGoLogo";

const navItems = [
  { label: "Home", href: "/", icon: HiHome },
  { label: "Messages", href: "/messages", icon: HiChatAlt2 },
  { label: "Profile", href: "/profile", icon: HiUser },
  { label: "Pro", href: "/pro", icon: HiSparkles },
];

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/" || pathname === "/posts";
    }
    return pathname === href.split("?")[0];
  };

  return (
    <aside className="fixed bottom-20 left-3 top-3 z-30 hidden w-[82px] lg:bottom-4 lg:left-4 lg:top-4 lg:flex">
      <div className="flex h-full w-full flex-col items-center rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-6 shadow-[0_8px_32px_rgba(30,20,10,0.07)]">

        {/* Logo */}
        <div className="mb-8">
          <PlaysGoLogo iconOnly />
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-3">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);

            return (
              <button
                key={label}
                title={label}
                onClick={() => router.push(href)}
                className={`group flex h-12 w-12 items-center justify-center rounded-full transition-[colors,transform] duration-200 transform-gpu will-change-transform ${
                  active
                    ? "bg-[var(--text-heading)] text-[var(--selected-fg)] shadow-sm scale-105"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)] hover:scale-105"
                }`}
              >
                <Icon className="text-2xl" />
              </button>
            );
          })}

          {/* Create Post */}
          <button
            title="Create Post"
            onClick={() => router.push("/createpost")}
            className={`mt-2 flex h-12 w-12 items-center justify-center rounded-full transition-[colors,transform] duration-200 ${
              pathname === "/createpost"
                ? "bg-[var(--brand)] text-white shadow-[0_4px_14px_rgba(255,60,31,0.35)]"
                : "border border-dashed border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-muted)] hover:bg-[var(--brand)] hover:text-white hover:border-[var(--brand)]"
            }`}
          >
            <HiOutlinePlus className="text-2xl" />
          </button>
        </nav>

        {/* Bottom */}
        <div className="mt-auto flex flex-col items-center gap-3">

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Settings */}
          <button
            title="Settings"
            onClick={() => router.push("/settings")}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-[colors,transform] duration-200 ${
              pathname === "/settings"
                ? "bg-[var(--text-heading)] text-[var(--selected-fg)] shadow-sm"
                : "text-[var(--text-muted)] hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
            }`}
          >
            <HiCog className="text-2xl" />
          </button>

          {/* More */}
          <button
            title="More"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--bg-input)] text-[var(--text-muted)] transition-[colors,transform] duration-200 hover:bg-[var(--text-heading)] hover:text-[var(--selected-fg)]"
          >
            <HiDotsVertical className="text-xl" />
          </button>

        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;