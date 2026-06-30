"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PostItems from "../PostItems";
import PostModal from "./PostModal";

const POSTS_PER_PAGE = 12;

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const cardVariants = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } } };

const Posts = ({ posts = [], isReady = true, activeFilter = "Nearby" }) => {
  const [post, setPost]     = useState();
  const [page, setPage]     = useState(1);
  const router              = useRouter();

  const openPost = (item) => { setPost(item); document.getElementById("my_modal_1").showModal(); };
  useEffect(() => { setPage(1); }, [posts]);

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const paginated  = useMemo(() => posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE), [page, posts]);
  const pageStart  = posts.length === 0 ? 0 : (page - 1) * POSTS_PER_PAGE + 1;
  const pageEnd    = posts.length === 0 ? 0 : Math.min(page * POSTS_PER_PAGE, posts.length);
  const feedLabel  = activeFilter === "Nearby" ? "Nearby posts" : `${activeFilter} posts`;

  return (
    <section className="space-y-4">

      {/* feed header */}
      <div className="flex h-11 items-center justify-between rounded-[14px] border border-[#E8EDF5] bg-white px-4 shadow-[0_1px_6px_rgba(15,23,42,0.05)]">
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] font-bold text-[#0F1623]">{feedLabel}</span>
          <span className="text-[11.5px] text-[#9CA3AF]">
            {isReady ? `${pageStart}–${pageEnd} of ${posts.length}` : "Loading…"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => router.push("/pro")}
          className="flex items-center gap-1 rounded-full border border-[#E8EDF5] bg-[#F8FAFC] px-3 py-1 text-[11px] font-semibold text-[#374151] transition hover:bg-[#0F1623] hover:text-white hover:border-[#0F1623]"
        >
          ✨ Go Pro
        </button>
      </div>

      <PostModal post={post} />

      {/* skeleton */}
      {!isReady ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[400px] animate-pulse rounded-[20px] bg-[#F0F4FF]" />
          ))}
        </div>

      /* empty */
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#E8EDF5] bg-white py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F0F4FF] text-2xl">🔍</div>
          <h4 className="text-[15px] font-bold text-[#0F1623]">No posts found</h4>
          <p className="mt-1.5 max-w-xs text-[13px] text-[#6B7280]">Try another keyword or switch filters.</p>
          <button
            type="button"
            onClick={() => router.push("/createpost")}
            className="mt-5 rounded-full bg-[#FF7A00] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(255,122,0,0.3)] transition hover:bg-[#F26A00]"
          >
            Create your first post
          </button>
        </div>

      /* grid */
      ) : (
        <>
          <motion.div
            key={`page-${page}`}
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            variants={containerVariants} initial="hidden" animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {paginated.map((item) => (
                <motion.div key={item.id} variants={cardVariants} layout className="flex h-full">
                  <PostItems post={item} onClick={() => openPost(item)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-2">
              <PagBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>←</PagBtn>
              {Array.from({ length: totalPages }, (_, i) => {
                const p = i + 1, active = p === page;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`flex h-8 min-w-[32px] items-center justify-center rounded-full px-2.5 text-[12px] font-semibold transition-colors ${
                      active ? "bg-[#0F1623] text-white shadow-sm" : "border border-[#E8EDF5] bg-white text-[#6B7280] hover:border-[#0F1623] hover:text-[#0F1623]"
                    }`}
                  >{p}</button>
                );
              })}
              <PagBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>→</PagBtn>
            </div>
          )}
        </>
      )}
    </section>
  );
};

const PagBtn = ({ children, ...props }) => (
  <button type="button"
    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8EDF5] bg-white text-[#6B7280] text-sm transition hover:border-[#0F1623] hover:text-[#0F1623] disabled:cursor-not-allowed disabled:opacity-40"
    {...props}>{children}</button>
);

export default Posts;
