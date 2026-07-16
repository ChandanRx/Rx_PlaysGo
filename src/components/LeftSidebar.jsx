"use client";

import React from "react";
import {
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/outline";

import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ui/ThemeToggle";
import PlaysGoLogo from "./PlaysGoLogo";

const navItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Messages", href: "/messages", icon: ChatBubbleLeftRightIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
  { label: "Pro", href: "/pro", icon: SparklesIcon },
];

/* Floating tooltip shown to the right of each icon (replaces native title) */
const Tooltip = ({ label }) => (
  <span
    className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 z-50 -translate-y-1/2 translate-x-1
               whitespace-nowrap rounded-lg bg-[var(--text-heading)] px-3 py-1.5 text-xs font-medium
               text-[var(--bg-card)] opacity-0 shadow-lg transition-all duration-200 ease-out
               group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0
               group-focus-visible:opacity-100 motion-reduce:transition-none"
    role="tooltip"
  >
    {label}
  </span>
);

const NavButton = ({ label, active, onClick, children, variant = "default" }) => {
  const base =
    "group relative flex h-11 w-11 items-center justify-center rounded-xl outline-none " +
    "transition-colors duration-200 ease-out motion-reduce:transition-none " +
    "focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-[var(--bg-card)]";

  const styles = {
    default: active
      ? "bg-[var(--text-heading)] text-[var(--selected-fg)] shadow-sm"
      : "text-[var(--text-muted)] hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]",
    brand: active
      ? "bg-[var(--brand)] text-[var(--on-brand)] shadow-[0_6px_18px_rgba(var(--brand-rgb),0.35)]"
      : "bg-[var(--bg-input)] text-[var(--text-muted)] hover:bg-[var(--brand)] hover:text-[var(--on-brand)] hover:shadow-[0_6px_18px_rgba(var(--brand-rgb),0.3)]",
  };

  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`${base} ${styles[variant]}`}
    >
      {/* Active indicator — small pill hugging the sidebar's left edge */}
      {variant === "default" && (
        <span
          aria-hidden="true"
          className={`absolute -left-[17px] top-1/2 w-[3px] -translate-y-1/2 rounded-full
                      bg-[var(--brand)] transition-all duration-300 ease-out motion-reduce:transition-none ${
                        active ? "h-6 opacity-100" : "h-0 opacity-0"
                      }`}
        />
      )}
      {children}
      <Tooltip label={label} />
    </button>
  );
};

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/" || pathname === "/posts";
    }
    const base = href.split("?")[0];
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <aside className="fixed bottom-20 left-3 top-3 z-30 hidden w-[76px] lg:bottom-4 lg:left-4 lg:top-4 lg:flex">
      <div
        className="flex h-full w-full flex-col items-center rounded-2xl border border-[var(--border-subtle)]
                   bg-[var(--bg-card)] px-3 py-5
                   shadow-[0_1px_2px_rgba(28,32,18,0.04),0_12px_40px_rgba(28,32,18,0.06)]"
      >
        {/* Logo */}
        <div className="mb-7">
          <PlaysGoLogo iconOnly />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col items-center gap-1.5" aria-label="Main">
          {navItems.map(({ label, href, icon: Icon }) => (
            <NavButton
              key={label}
              label={label}
              active={isActive(href)}
              onClick={() => router.push(href)}
            >
              <Icon className="h-[22px] w-[22px]" />
            </NavButton>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-4 h-px w-8 bg-[var(--border-subtle)]" aria-hidden="true" />

        {/* Create Post */}
        <NavButton
          label="Create post"
          variant="brand"
          active={pathname === "/createpost"}
          onClick={() => router.push("/createpost")}
        >
          <PlusIcon className="h-[22px] w-[22px]" strokeWidth={2.2} />
        </NavButton>

        {/* Bottom */}
        <div className="mt-auto flex flex-col items-center gap-1.5">
          <ThemeToggle />

          <NavButton
            label="Settings"
            active={pathname === "/settings"}
            onClick={() => router.push("/settings")}
          >
            <Cog6ToothIcon className="h-[22px] w-[22px]" />
          </NavButton>

          <NavButton label="More">
            <EllipsisVerticalIcon className="h-5 w-5" />
          </NavButton>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
