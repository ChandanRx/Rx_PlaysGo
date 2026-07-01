"use client";

import React, { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  HiChatAlt2,
  HiHome,
  HiLocationMarker,
  HiOutlinePlus,
  HiUser,
} from "react-icons/hi";

import DashboardHeader from "./DashboardHeader";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

const bottomNav = [
  { label: "Home", href: "/", icon: HiHome },
  { label: "Explore", href: "/posts", icon: HiLocationMarker },
  { label: "Create", href: "/createpost", icon: HiOutlinePlus },
  { label: "Chat", href: "/messages", icon: HiChatAlt2 },
  { label: "Profile", href: "/profile", icon: HiUser },
];

const AppShell = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href.split("?")[0];
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">

      {/* Desktop Sidebars */}

      <LeftSidebar />
      <RightSidebar />

      {/* Main Content */}

      <div className="min-h-screen px-2 pb-24 pt-2 lg:pl-[122px] lg:pr-[340px] lg:pb-4 lg:pt-4">

        <div className="mx-auto h-full min-h-[calc(100vh-4rem)] overflow-y-auto rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-4 shadow-[0_2px_16px_rgba(15,23,42,0.07)] md:px-5 md:py-5 lg:min-h-[calc(100vh-2rem)] lg:px-6 lg:py-5">

          <Suspense fallback={null}>
            <DashboardHeader />
          </Suspense>

          {children}

        </div>

      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">

        <div className="mx-auto flex max-w-md items-center justify-around rounded-[999px] border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-2 shadow-[0_8px_32px_rgba(15,23,42,0.10)]">

          {bottomNav.map(({ label, href, icon: Icon }) => {

            const active = isActive(href);

            return (

              <button
                key={label}
                type="button"
                onClick={() => router.push(href)}
                className={`flex flex-col items-center gap-1 rounded-full px-3 py-2 transition-colors duration-200 ${
                  active
                    ? "bg-[var(--text-heading)] text-[var(--bg-card)] shadow"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
                }`}
              >

                <Icon className="text-xl" />

                <span className="text-[10px] font-semibold">
                  {label}
                </span>

              </button>

            );

          })}

        </div>

      </nav>
    </div>
  );
};

export default AppShell;