"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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

// Only the feed pages need their scroll position remembered across a
// details-view visit; every other route always starts at the top.
const FEED_PATHS = ["/", "/posts"];
const SCROLL_KEY_PREFIX = "quibly_scroll_";

// Admin dashboard is desktop/admin use only — deliberately not a mobile tab.
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
  const contentRef = useRef(null);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const el = contentRef.current;
    const prevPath = prevPathRef.current;

    if (el && FEED_PATHS.includes(prevPath)) {
      sessionStorage.setItem(SCROLL_KEY_PREFIX + prevPath, String(el.scrollTop));
    }
    prevPathRef.current = pathname;

    if (!el) return;

    if (FEED_PATHS.includes(pathname)) {
      const saved = Number(sessionStorage.getItem(SCROLL_KEY_PREFIX + pathname)) || 0;
      requestAnimationFrame(() => requestAnimationFrame(() => { el.scrollTop = saved; }));
    } else {
      el.scrollTop = 0;
    }
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    const base = href.split("?")[0];
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  // The whole messages section owns its own header/right-rail space (it has
  // its own conversation list + chat panels), but the floating bottom nav
  // ("tabs") should only hide once an actual conversation is open — the
  // inbox list itself is just another screen you navigate from, same as
  // WhatsApp keeps its own tab bar visible on the chat list.
  const isMessagesSection = pathname.startsWith("/messages");
  const isChatDetailPage = isMessagesSection && pathname !== "/messages";

  // Switching between /messages/[chatId] conversations should feel instant,
  // not like a full page navigation — keep the outer transition key stable
  // across the whole messages section instead of keying on every chatId.
  const transitionKey = isMessagesSection ? "/messages" : pathname;

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">

      {/* Desktop Sidebars */}

      <LeftSidebar />
      {!isMessagesSection && <RightSidebar />}

      {/* Main Content */}

      <div
        className={`min-h-screen px-2 pt-2 lg:pl-[122px] lg:pb-4 lg:pt-4 ${
          isChatDetailPage ? "pb-2" : "pb-24"
        } ${isMessagesSection ? "lg:pr-4" : "lg:pr-[340px]"}`}
      >

        <div
          ref={contentRef}
          className={`mx-auto rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-[0_2px_16px_rgba(30,20,10,0.06)] ${
            isMessagesSection
              ? `${isChatDetailPage ? "h-[calc(100vh-4rem)] overflow-hidden" : "min-h-[calc(100vh-4rem)] overflow-y-auto"} lg:h-[calc(100vh-2rem)] lg:overflow-hidden`
              : "min-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-4 md:px-5 md:py-5 lg:min-h-[calc(100vh-2rem)] lg:px-6 lg:py-5"
          }`}
        >

          {!isMessagesSection && (
            <Suspense fallback={null}>
              <DashboardHeader />
            </Suspense>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={transitionKey}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className={isMessagesSection ? (isChatDetailPage ? "h-full min-h-0" : "lg:h-full lg:min-h-0") : ""}
            >
              {children}
            </motion.div>
          </AnimatePresence>

        </div>

      </div>

      {/* Mobile Bottom Navigation — floating glass capsule, labels below icons */}
      {/* Hidden only inside an open conversation — the inbox list keeps it, like WhatsApp. */}
      {!isChatDetailPage && (
        <nav
          className="fixed inset-x-4 z-50 lg:hidden"
          style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >

          <div className="mx-auto flex max-w-md items-stretch gap-1 rounded-[28px] border border-white/40 bg-[var(--bg-card)]/75 p-1.5 shadow-[0_8px_28px_rgba(30,20,10,0.14)] backdrop-blur-xl">

            {bottomNav.map(({ label, href, icon: Icon }) => {

              const active = isActive(href);

              return (

                <button
                  key={label}
                  type="button"
                  onClick={() => router.push(href)}
                  aria-label={label}
                  className="relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-[30px]"
                >

                  {active && (
                    <motion.span
                      layoutId="bottom-nav-active-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-[var(--brand)] shadow-[0_4px_14px_rgba(255,60,31,0.35)]"
                    />
                  )}

                  <motion.span
                    animate={{ scale: active ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`relative z-10 flex flex-col items-center gap-0.5 transition-colors duration-200 ${
                      active ? "text-white" : "text-[var(--text-muted)]"
                    }`}
                  >
                    <Icon className="text-[19px]" />
                  </motion.span>

                </button>

              );

            })}

          </div>

        </nav>
      )}
    </div>
  );
};

export default AppShell;