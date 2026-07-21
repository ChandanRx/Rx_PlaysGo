"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { m } from "framer-motion";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { CheckIcon, UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { backdropFade, modalDialog } from "../../shared/motionPresets";
import {
  CURRENT_USER_ID,
  FOLLOW_CHANGE_EVENT,
  followUser,
  getUserById,
  isFollowing,
  unfollowUser,
} from "../../shared/dummyPosts";

// Social-media style follower / following list. Given the profile owner and the
// list type, it derives the live list of users from the follow graph and lets
// you follow / unfollow anyone right from the row. It re-reads on every
// FOLLOW_CHANGE_EVENT so counts and button states never drift.
const FollowListModal = ({ ownerId, type = "followers", onClose }) => {
  const router = useRouter();
  const title = type === "followers" ? "Followers" : "Following";
  const [rows, setRows] = useState([]);

  const load = useCallback(() => {
    const owner = getUserById(ownerId);
    const ids = (type === "followers" ? owner?.followers : owner?.following) || [];
    const users = ids.map((id) => getUserById(id)).filter(Boolean);
    setRows(
      users.map((user) => ({
        user,
        isMe: user.id === CURRENT_USER_ID,
        following: isFollowing(CURRENT_USER_ID, user.id),
      })),
    );
  }, [ownerId, type]);

  useEffect(() => {
    load();
    window.addEventListener(FOLLOW_CHANGE_EVENT, load);
    return () => window.removeEventListener(FOLLOW_CHANGE_EVENT, load);
  }, [load]);

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

  const goToProfile = (username) => {
    onClose?.();
    router.push(`/profile/${username}`);
  };

  const toggleFollow = (row) => {
    if (row.following) unfollowUser(CURRENT_USER_ID, row.user.id);
    else followUser(CURRENT_USER_ID, row.user.id);
    // followUser/unfollowUser dispatch FOLLOW_CHANGE_EVENT → load() refreshes.
  };

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
            <h2 id="follow-list-title" className="flex items-baseline gap-2 text-[16px] font-black text-[var(--text-heading)]">
              {title}
              <span className="text-[13px] font-bold text-[var(--text-muted)]">{rows.length}</span>
            </h2>
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
            {rows.length === 0 ? (
              <p className="px-3 py-10 text-center text-[13px] text-[var(--text-muted)]">
                {type === "followers" ? "No followers yet." : "Not following anyone yet."}
              </p>
            ) : (
              rows.map(({ user, isMe, following }) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition hover:bg-[var(--bg-input)]"
                >
                  <button
                    type="button"
                    onClick={() => goToProfile(user.username)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={44}
                      height={44}
                      unoptimized={user.image?.startsWith("data:")}
                      className="h-11 w-11 shrink-0 rounded-full border border-[var(--border-subtle)] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="truncate text-[13.5px] font-bold text-[var(--text-heading)]">{user.name}</p>
                        {user.verified && <CheckBadgeIcon className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" />}
                      </div>
                      <p className="truncate text-[12px] text-[var(--text-muted)]">@{user.username}</p>
                    </div>
                  </button>

                  {isMe ? (
                    <span className="shrink-0 rounded-full bg-[var(--bg-input)] px-3 py-1.5 text-[11px] font-bold text-[var(--text-muted)]">
                      You
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleFollow({ user, following })}
                      aria-pressed={following}
                      className={`inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-full px-3.5 text-[12px] font-bold transition active:scale-[0.97] ${
                        following
                          ? "border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-body)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
                          : "bg-[var(--text-heading)] text-[var(--bg-card)] shadow-sm hover:opacity-90"
                      }`}
                    >
                      {following ? (
                        <>
                          <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                          Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </m.div>
      </div>
    </>
  );
};

export default FollowListModal;
