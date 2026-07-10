"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { backdropFade, modalDialog } from "../../shared/motionPresets";
import { getUserById } from "../../shared/dummyPosts";

// Renders a list of users from an array of ids (a followers or following list).
// Each row links to that user's profile and closes the modal on navigation.
const FollowListModal = ({ title, userIds = [], onClose }) => {
  const users = userIds.map((id) => getUserById(id)).filter(Boolean);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      <m.div
        {...backdropFade}
        className="fixed inset-0 z-[100] bg-[var(--text-heading)]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[101] flex items-end justify-center p-3 sm:items-center sm:p-4" onClick={onClose}>
        <m.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="follow-list-title"
          variants={modalDialog}
          initial="hidden" animate="visible" exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[80vh] w-full flex-col overflow-hidden rounded-2xl bg-[var(--bg-card)] shadow-[0_20px_60px_rgba(28,32,18,0.18)] sm:max-w-sm"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
            <h2 id="follow-list-title" className="text-[16px] font-black text-[var(--text-heading)]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
            >
              <XMarkIcon className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {users.length === 0 ? (
              <p className="px-3 py-8 text-center text-[13px] text-[var(--text-muted)]">No one here yet.</p>
            ) : (
              users.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[var(--bg-input)]"
                >
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full border border-[var(--border-subtle)] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="truncate text-[13.5px] font-bold text-[var(--text-heading)]">{user.name}</p>
                      {user.verified && <CheckBadgeIcon className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" />}
                    </div>
                    <p className="truncate text-[12px] text-[var(--text-muted)]">@{user.username}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </m.div>
      </div>
    </>
  );
};

export default FollowListModal;
