"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon, MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getUserPosts } from "../../shared/dummyPosts";
import { backdropFade } from "../../shared/motionPresets";
import Card from "../ui/Card";
import Button from "../ui/Button";
import AdminBarChart from "./AdminBarChart";
import { CATEGORY_ORDER } from "./adminAnalytics";
import { categoryColor, STATUS_COLORS } from "./vizTheme";

const panelMotion = {
  initial: { x: "100%", opacity: 0.6 },
  animate: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 320, damping: 32 } },
  exit: { x: "100%", opacity: 0.4, transition: { duration: 0.18, ease: "easeIn" } },
};

/* Slide-over detail for a single user, opened from the Users table. Everything
 * is derived from the user's own posts (the mock data layer has no richer user
 * record). Render inside <AnimatePresence> so the exit slide runs. */
const AdminUserDrawer = ({ user, onClose, onViewPosts }) => {
  const posts = useMemo(() => (user ? getUserPosts(user.email) : []), [user]);

  const categoryData = useMemo(() => {
    const counts = new Map(CATEGORY_ORDER.map((c) => [c, 0]));
    posts.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));
    return Array.from(counts, ([label, value]) => ({ label, value, color: categoryColor(label) }))
      .filter((d) => d.value > 0);
  }, [posts]);

  if (!user) return null;

  const activeCount = posts.filter((p) => (p.status || "Active") === "Active").length;

  return (
    <>
      <m.div
        {...backdropFade}
        className="fixed inset-0 z-[120] bg-[var(--text-heading)]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-[121] flex max-w-full p-3 sm:p-4" onClick={onClose}>
        <m.div {...panelMotion} onClick={(e) => e.stopPropagation()} className="h-full w-[min(92vw,380px)]">
          <Card
            variant="panel"
            hover={false}
            padding={false}
            role="dialog"
            aria-modal="true"
            aria-label={`${user.name} details`}
            className="flex h-full flex-col"
          >
            {/* header */}
            <div className="flex items-start gap-3 border-b border-[var(--border-subtle)] p-5">
              <Image
                src={user.image}
                alt={user.name}
                width={44}
                height={44}
                unoptimized={user.image?.startsWith("data:")}
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 truncate text-[15px] font-black text-[var(--text-heading)]">
                  {user.name}
                  {user.isVerified && <CheckBadgeIcon className="h-4 w-4 shrink-0 text-[var(--success)]" />}
                </p>
                <p className="truncate text-[12px] text-[var(--text-faint)]">{user.email}</p>
                {user.city && (
                  <p className="mt-1 flex items-center gap-1 text-[12px] text-[var(--text-muted)]">
                    <MapPinIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                    {user.city}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
              >
                <XMarkIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
              </button>
            </div>

            {/* scrollable body */}
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
              {/* quick stats */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 p-3">
                  <p className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">Total posts</p>
                  <p className="mt-1 text-[20px] font-black leading-none text-[var(--text-heading)]">{user.postCount}</p>
                </div>
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 p-3">
                  <p className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">Active</p>
                  <p className="mt-1 text-[20px] font-black leading-none text-[var(--text-heading)]">{activeCount}</p>
                </div>
              </div>

              {/* category breakdown */}
              {categoryData.length > 0 && (
                <div>
                  <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                    Posts by category
                  </p>
                  <AdminBarChart data={categoryData} ariaLabel={`${user.name} posts by category`} />
                </div>
              )}

              {/* recent posts */}
              {posts.length > 0 && (
                <div>
                  <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                    Recent posts
                  </p>
                  <ul className="space-y-1.5">
                    {posts.slice(0, 5).map((post) => (
                      <li
                        key={post.id}
                        className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] px-3 py-2"
                      >
                        <span
                          aria-hidden
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ background: STATUS_COLORS[post.status] || STATUS_COLORS.Active }}
                        />
                        <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-[var(--text-heading)]">
                          {post.title}
                        </span>
                        <span className="shrink-0 text-[11px] text-[var(--text-faint)]">{post.status || "Active"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* footer */}
            <div className="border-t border-[var(--border-subtle)] p-4">
              <Button variant="primary" size="sm" className="w-full" onClick={() => onViewPosts(user.email)}>
                View all posts
                <ArrowRightIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
              </Button>
            </div>
          </Card>
        </m.div>
      </div>
    </>
  );
};

export default AdminUserDrawer;
