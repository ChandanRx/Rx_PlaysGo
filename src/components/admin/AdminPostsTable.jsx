"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  ArrowDownTrayIcon, EyeIcon, MagnifyingGlassIcon, NoSymbolIcon, SparklesIcon, TrashIcon, XMarkIcon,
} from "@heroicons/react/24/outline";
import { deletePost, getPosts, POST_STATUSES } from "../../shared/dummyPosts";
import { featurePost, updatePostStatus } from "../../shared/adminStore";
import { downloadCsv } from "../../shared/csv";
import ConfirmDialog from "../ui/ConfirmDialog";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";
import { useToast } from "../ui/Toast";
import { AdminEmpty, AdminLoading } from "./AdminTableState";
import { SortHeader, useTableSort } from "./sortable";
import { categoryColor } from "./vizTheme";

const CATEGORY_OPTIONS = ["All", "Players", "Local Help", "For Sale"];
const STATUS_OPTIONS = ["All", ...POST_STATUSES];

const STATUS_STYLES = {
  Active: "bg-[var(--success-soft)] text-[var(--success)]",
  Draft: "bg-[var(--bg-input)] text-[var(--text-muted)]",
  Closed: "bg-[var(--text-heading)]/10 text-[var(--text-heading)]",
  Expired: "bg-[var(--danger-soft)] text-[var(--danger)]",
};

const AdminPostsTable = ({ authorEmail = "", onClearAuthorFilter, onOpenPost, onDataChange }) => {
  const [posts, setPosts] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const toast = useToast();

  const refresh = () => setPosts(getPosts());
  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (posts || []).filter((post) => {
      if (authorEmail && post.email !== authorEmail) return false;
      if (categoryFilter !== "All" && post.category !== categoryFilter) return false;
      if (statusFilter !== "All" && (post.status || "Active") !== statusFilter) return false;
      if (q && !post.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [posts, authorEmail, categoryFilter, statusFilter, search]);

  const { sorted, sort, toggle } = useTableSort(filtered);

  const mutate = (fn) => {
    fn();
    refresh();
    onDataChange?.();
  };

  const handleFeature = (id) => {
    mutate(() => featurePost(id));
    toast.success("Post featured");
  };
  const handleClose = (id) => {
    mutate(() => updatePostStatus(id, "Closed"));
    toast.info("Post closed");
  };
  const handleDelete = (id) => {
    mutate(() => {
      deletePost(id);
      setConfirmingDelete(null);
    });
    toast.danger("Post deleted");
  };

  const handleExport = () => {
    downloadCsv(
      "posts.csv",
      [
        { header: "Title", value: (p) => p.title },
        { header: "Category", value: (p) => p.category },
        { header: "Subcategory", value: (p) => p.subCategory },
        { header: "Author", value: (p) => p.userName },
        { header: "Email", value: (p) => p.email },
        { header: "Location", value: (p) => p.location },
        { header: "Status", value: (p) => p.status || "Active" },
        { header: "Posted", value: (p) => p.postedTime },
        { header: "Featured", value: (p) => (p.featurePost ? "Yes" : "No") },
      ],
      sorted,
    );
    toast.success(`Exported ${sorted.length} post${sorted.length === 1 ? "" : "s"}`);
  };

  return (
    <div>
      {/* filters */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 sm:max-w-[240px]">
          <MagnifyingGlassIcon className="h-3.5 w-3.5 shrink-0 text-[var(--text-faint)]" strokeWidth={2.25} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="w-full min-w-0 bg-transparent text-[12.5px] text-[var(--text-heading)] outline-none focus-visible:shadow-none placeholder:text-[var(--text-faint)]"
          />
        </div>

        <Dropdown
          variant="field"
          options={CATEGORY_OPTIONS}
          value={categoryFilter}
          onChange={setCategoryFilter}
          className="shrink-0"
          buttonClassName="border border-[var(--border-subtle)] bg-[var(--bg-card)] py-2 text-[12.5px] font-semibold"
        />

        <Dropdown
          variant="field"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          className="shrink-0"
          buttonClassName="border border-[var(--border-subtle)] bg-[var(--bg-card)] py-2 text-[12.5px] font-semibold"
        />

        {authorEmail && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--brand-soft)] px-3 py-2 text-[12px] font-semibold text-[var(--brand)]">
            Author: {authorEmail}
            <button type="button" onClick={onClearAuthorFilter} aria-label="Clear author filter">
              <XMarkIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </span>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={handleExport}
          disabled={!posts || filtered.length === 0}
          className="shrink-0 sm:ml-auto"
        >
          <ArrowDownTrayIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
          Export CSV
        </Button>
      </div>

      {/* results count */}
      {posts !== null && filtered.length > 0 && (
        <p className="mt-3 text-[11.5px] font-medium text-[var(--text-faint)]">
          Showing {filtered.length} of {posts.length} post{posts.length === 1 ? "" : "s"}
        </p>
      )}

      {/* table */}
      <div className="mt-2 overflow-x-auto">
        {posts === null ? (
          <AdminLoading rows={5} />
        ) : filtered.length === 0 ? (
          <AdminEmpty
            icon={MagnifyingGlassIcon}
            title="No posts match"
            message="Try a different search or loosen the filters."
            action={
              (search || categoryFilter !== "All" || statusFilter !== "All" || authorEmail) && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("All");
                    setStatusFilter("All");
                    onClearAuthorFilter?.();
                  }}
                >
                  Clear filters
                </Button>
              )
            }
          />
        ) : (
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                <SortHeader label="Title" sortKey="title" sort={sort} onSort={toggle} />
                <SortHeader label="Category" sortKey="category" sort={sort} onSort={toggle} />
                <SortHeader label="Author" sortKey="userName" sort={sort} onSort={toggle} />
                <SortHeader label="Location" sortKey="location" sort={sort} onSort={toggle} />
                <SortHeader label="Status" sortKey="status" sort={sort} onSort={toggle} />
                <th className="py-2.5 pr-4">Posted</th>
                <th className="py-2.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((post) => (
                <tr key={post.id} className="border-b border-[var(--border-subtle)] transition-colors last:border-0 hover:bg-[var(--bg-secondary)]/60">
                  <td className="max-w-[220px] py-2.5 pr-4">
                    <p className="truncate font-semibold text-[var(--text-heading)]">
                      {post.title}
                      {post.featurePost && (
                        <SparklesIcon className="ml-1.5 inline-block h-3 w-3 text-[var(--brand)]" strokeWidth={2.5} />
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[var(--text-faint)]">{post.subCategory}</p>
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: categoryColor(post.category) }} />
                      {post.category}
                    </span>
                  </td>
                  <td className="max-w-[160px] truncate py-2.5 pr-4 text-[var(--text-body)]">{post.userName}</td>
                  <td className="max-w-[160px] truncate py-2.5 pr-4 text-[var(--text-muted)]">{post.location}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`rounded-md px-2 py-1 text-[10.5px] font-semibold ${STATUS_STYLES[post.status] || STATUS_STYLES.Active}`}>
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
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
                      >
                        <EyeIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                      </button>
                      <button
                        type="button"
                        aria-label="Feature post"
                        onClick={() => handleFeature(post.id)}
                        disabled={post.featurePost}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <SparklesIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                      </button>
                      <button
                        type="button"
                        aria-label="Close post"
                        onClick={() => handleClose(post.id)}
                        disabled={post.status === "Closed"}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <NoSymbolIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete post"
                        onClick={() => setConfirmingDelete(post)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)] transition hover:bg-[var(--danger-border)]"
                      >
                        <TrashIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
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
          <ConfirmDialog
            title="Delete this post?"
            description={`"${confirmingDelete.title}" will be permanently removed. This can't be undone.`}
            onCancel={() => setConfirmingDelete(null)}
            onConfirm={() => handleDelete(confirmingDelete.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPostsTable;
