"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ban, Eye, Search, Sparkles, Trash2, X } from "lucide-react";
import { deletePost, getPosts, POST_STATUSES } from "../../shared/dummyPosts";
import { featurePost, updatePostStatus } from "../../shared/adminStore";

const CATEGORY_OPTIONS = ["All", "Players", "Local Help", "For Sale"];
const STATUS_OPTIONS = ["All", ...POST_STATUSES];

const STATUS_STYLES = {
  Active: "bg-[#22C55E]/15 text-[#16A34A]",
  Draft: "bg-[var(--bg-input)] text-[var(--text-muted)]",
  Closed: "bg-[var(--text-heading)]/10 text-[var(--text-heading)]",
  Expired: "bg-red-100 text-red-600",
};

const ConfirmDeleteDialog = ({ title, onCancel, onConfirm }) => (
  <>
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[100] bg-[var(--text-heading)]/40 backdrop-blur-sm"
      onClick={onCancel}
    />
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4" onClick={onCancel}>
      <motion.div
        role="alertdialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-sm bg-[var(--bg-card)] p-5 shadow-[0_20px_60px_rgba(30,20,10,0.18)]"
      >
        <h3 className="text-[16px] font-black text-[var(--text-heading)]">Delete this post?</h3>
        <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">
          &quot;{title}&quot; will be permanently removed. This can&apos;t be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-sm px-4 py-2 text-[13px] font-semibold text-[var(--text-muted)] transition hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="rounded-sm border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-semibold text-red-600 transition hover:bg-red-100">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  </>
);

const AdminPostsTable = ({ authorEmail = "", onClearAuthorFilter, onOpenPost, onDataChange }) => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmingDelete, setConfirmingDelete] = useState(null);

  const refresh = () => setPosts(getPosts());
  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      if (authorEmail && post.email !== authorEmail) return false;
      if (categoryFilter !== "All" && post.category !== categoryFilter) return false;
      if (statusFilter !== "All" && (post.status || "Active") !== statusFilter) return false;
      if (q && !post.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [posts, authorEmail, categoryFilter, statusFilter, search]);

  const mutate = (fn) => {
    fn();
    refresh();
    onDataChange?.();
  };

  const handleFeature = (id) => mutate(() => featurePost(id));
  const handleClose = (id) => mutate(() => updatePostStatus(id, "Closed"));
  const handleDelete = (id) => mutate(() => {
    deletePost(id);
    setConfirmingDelete(null);
  });

  return (
    <div>
      {/* filters */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 sm:max-w-[240px]">
          <Search className="h-3.5 w-3.5 shrink-0 text-[var(--text-faint)]" strokeWidth={2.25} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="w-full min-w-0 bg-transparent text-[12.5px] text-[var(--text-heading)] outline-none focus-visible:shadow-none placeholder:text-[var(--text-faint)]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="shrink-0 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-[12.5px] font-semibold text-[var(--text-body)] outline-none"
        >
          {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="shrink-0 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-[12.5px] font-semibold text-[var(--text-body)] outline-none"
        >
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {authorEmail && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-sm bg-[var(--brand-soft)] px-3 py-2 text-[12px] font-semibold text-[var(--brand)]">
            Author: {authorEmail}
            <button type="button" onClick={onClearAuthorFilter} aria-label="Clear author filter">
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </span>
        )}
      </div>

      {/* table */}
      <div className="mt-4 overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[var(--text-muted)]">No posts match these filters.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                <th className="py-2.5 pr-4">Title</th>
                <th className="py-2.5 pr-4">Category</th>
                <th className="py-2.5 pr-4">Author</th>
                <th className="py-2.5 pr-4">Location</th>
                <th className="py-2.5 pr-4">Status</th>
                <th className="py-2.5 pr-4">Posted</th>
                <th className="py-2.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className="border-b border-[var(--border-subtle)] last:border-0">
                  <td className="max-w-[220px] truncate py-2.5 pr-4 font-semibold text-[var(--text-heading)]">
                    {post.title}
                    {post.featurePost && (
                      <Sparkles className="ml-1.5 inline-block h-3 w-3 text-[var(--brand)]" strokeWidth={2.5} />
                    )}
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--text-muted)]">{post.category}</td>
                  <td className="max-w-[160px] truncate py-2.5 pr-4 text-[var(--text-body)]">{post.userName}</td>
                  <td className="max-w-[160px] truncate py-2.5 pr-4 text-[var(--text-muted)]">{post.location}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`rounded-sm px-2 py-1 text-[10.5px] font-semibold ${STATUS_STYLES[post.status] || STATUS_STYLES.Active}`}>
                      {post.status || "Active"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--text-faint)]">{post.postedTime}</td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        aria-label="View post"
                        onClick={() => onOpenPost(post)}
                        className="flex h-7 w-7 items-center justify-center rounded-sm border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
                      >
                        <Eye className="h-3.5 w-3.5" strokeWidth={2.25} />
                      </button>
                      <button
                        type="button"
                        aria-label="Feature post"
                        onClick={() => handleFeature(post.id)}
                        disabled={post.featurePost}
                        className="flex h-7 w-7 items-center justify-center rounded-sm border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} />
                      </button>
                      <button
                        type="button"
                        aria-label="Close post"
                        onClick={() => handleClose(post.id)}
                        disabled={post.status === "Closed"}
                        className="flex h-7 w-7 items-center justify-center rounded-sm border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Ban className="h-3.5 w-3.5" strokeWidth={2.25} />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete post"
                        onClick={() => setConfirmingDelete(post)}
                        className="flex h-7 w-7 items-center justify-center rounded-sm border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {confirmingDelete && (
          <ConfirmDeleteDialog
            title={confirmingDelete.title}
            onCancel={() => setConfirmingDelete(null)}
            onConfirm={() => handleDelete(confirmingDelete.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPostsTable;
