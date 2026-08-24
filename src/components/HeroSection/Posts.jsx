"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import PostItems from "../PostItems";
import { PostCardSkeletonGrid } from "../PostCardSkeleton";
import QuickActions from "./QuickActions";
import PostModal from "../PostModal";
import ReportPostModal from "../ReportPostModal";
import Button from "../ui/Button";
import { useToast } from "../ui/Toast";
import { cardRevealUp, loadSequence, makeSequencedContainer } from "../../shared/motionPresets";
import { dummyUser } from "../../shared/dummyPosts";

const POSTS_PER_PAGE = 12;

const Posts = ({ posts = [], isReady = true, activeFilter = "Nearby", activeSport = "" }) => {
  const [page, setPage]         = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [reportingPost, setReportingPost] = useState(null);
  const router                  = useRouter();
  const pathname                = usePathname();
  const toast                   = useToast();

  const openPost = (item) => { setSelectedPost(item); };

  const handleEdit = (item) => {
    setSelectedPost(null);
    router.push(`/createpost?edit=${encodeURIComponent(item.id)}`);
  };
  useEffect(() => { setPage(1); }, [posts]);

  // The card grid lives inside AppShell's <AnimatePresence initial={false}>,
  // which suppresses enter animations on the very first app load — so cards only
  // animated when navigating back to the page, never on a fresh load. Flipping
  // this after mount turns the reveal into a post-mount state change, which is
  // NOT gated by presence-initial, so cards animate on first load too.
  const [cardsRevealed, setCardsRevealed] = useState(false);
  useEffect(() => { setCardsRevealed(true); }, []);

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const paginated  = useMemo(() => posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE), [page, posts]);

  // Region 3 of the load choreography — the card grid, last in sequence. Keyed
  // on readiness + page so the page-anchored delay is captured when the grid
  // first renders (after posts load) and re-runs immediately on page change.
  const cardContainer = useMemo(
    () => makeSequencedContainer(loadSequence.cards, 0.09),
    [isReady, page],
  );
  const pageStart  = posts.length === 0 ? 0 : (page - 1) * POSTS_PER_PAGE + 1;
  const pageEnd    = posts.length === 0 ? 0 : Math.min(page * POSTS_PER_PAGE, posts.length);
  const feedLabel  = activeSport
    ? `${activeSport} posts`
    : activeFilter === "Nearby" ? "Nearby posts" : `${activeFilter} posts`;

  return (
    <section className="space-y-4">

      {/* ═══ MOBILE — Quick Actions + section header (hidden at lg) ═══ */}
      <div className="space-y-4 lg:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--text-heading)]">{feedLabel}</h2>
          {pathname === "/" && (
            <button
              type="button"
              onClick={() => router.push("/posts")}
              className="flex items-center gap-0.5 text-[13px] font-semibold text-[var(--brand)] active:opacity-70"
            >
              See All
              <ChevronRightIcon className="h-4 w-4" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* ═══ DESKTOP — feed header (unchanged) ═══ */}
      <div className="hidden h-11 items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 shadow-[0_1px_6px_rgba(28,32,18,0.05)] lg:flex">
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] font-bold text-[var(--text-heading)]">{feedLabel}</span>
          <span className="text-[11.5px] text-[var(--text-faint)]">
            {isReady ? `${pageStart}–${pageEnd} of ${posts.length}` : "Loading…"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => router.push("/pro")}
          className="flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 text-[11px] font-semibold text-[var(--text-body)] transition hover:bg-[var(--text-heading)] hover:text-[var(--bg-card)] hover:border-[var(--text-heading)]"
        >
          <SparklesIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
          Go Pro
        </button>
      </div>

      {/* skeleton */}
      {!isReady ? (
        <PostCardSkeletonGrid count={6} />

      /* empty */
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)]">
            <MagnifyingGlassIcon className="h-7 w-7" strokeWidth={1.9} />
          </div>
          <h4 className="text-[15px] font-bold text-[var(--text-heading)]">No posts found</h4>
          <p className="mt-1.5 max-w-xs text-[13px] text-[var(--text-muted)]">Try another keyword or switch filters.</p>
          <Button
            variant="yellow"
            size="md"
            onClick={() => router.push("/createpost")}
            className="mt-5"
          >
            Create your first post
          </Button>
        </div>

      /* grid */
      ) : (
        <>
          {/* Keyed by page so cards remount and the reveal replays on page
              change, not on every parent re-render. Each card rises up with a
              light bounce as it scrolls into view (whileInView, once). */}
          <m.div
            key={`page-${page}`}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-3"
            variants={cardContainer}
            initial="hidden"
            animate={cardsRevealed ? "show" : "hidden"}
          >
            {paginated.map((item) => (
              <m.div key={item.id} variants={cardRevealUp} className="flex h-full">
                <PostItems post={item} onClick={() => openPost(item)} onReport={setReportingPost} onEdit={handleEdit} />
              </m.div>
            ))}
          </m.div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-2">
              <PagBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeftIcon className="h-4 w-4" strokeWidth={2.25} />
              </PagBtn>
              {Array.from({ length: totalPages }, (_, i) => {
                const p = i + 1, active = p === page;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2.5 text-[12px] font-semibold transition-colors ${
                      active ? "bg-[var(--selected-bg)] text-[var(--selected-fg)] shadow-sm" : "border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
                    }`}
                  >{p}</button>
                );
              })}
              <PagBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronRightIcon className="h-4 w-4" strokeWidth={2.25} />
              </PagBtn>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {selectedPost && (
          <PostModal
            key={selectedPost.id}
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onEdit={selectedPost.email?.toLowerCase() === dummyUser.email.toLowerCase() ? handleEdit : undefined}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reportingPost && (
          <ReportPostModal
            key={`report-${reportingPost.id}`}
            post={reportingPost}
            onClose={() => setReportingPost(null)}
            onReported={() => toast.success("Report submitted — our team will review it.")}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const PagBtn = ({ children, ...props }) => (
  <button type="button"
    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] text-sm transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)] disabled:cursor-not-allowed disabled:opacity-40"
    {...props}>{children}</button>
);

export default Posts;
