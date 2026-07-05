"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, CircleCheck, ClipboardList, Handshake, Inbox } from "lucide-react";
import PostItems from "../../components/PostItems";
import PostModal from "../../components/PostModal";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileStats from "../../components/profile/ProfileStats";
import EditProfileModal from "../../components/profile/EditProfileModal";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import {
  POST_STATUSES,
  deletePost,
  dummyUser,
  getStoredUserProfile,
  getUserPosts,
  updateUserProfile,
} from "../../shared/dummyPosts";

const EMPTY_STATE_COPY = {
  Active: { title: "No posts yet", desc: "Create your first post to get started." },
  Draft: { title: "No drafts saved", desc: "Posts you save as drafts will show up here." },
  Closed: { title: "No closed posts", desc: "Posts you mark as closed will show up here." },
  Expired: { title: "No expired posts", desc: "Posts past their date will show up here." },
};

const ConfirmDeleteDialog = ({ onCancel, onConfirm }) => (
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
        aria-labelledby="confirm-delete-title"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-sm bg-[var(--bg-card)] p-5 shadow-[0_20px_60px_rgba(30,20,10,0.18)]"
      >
        <h3 id="confirm-delete-title" className="text-[16px] font-black text-[var(--text-heading)]">Delete this post?</h3>
        <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">
          This can&apos;t be undone. The post will be permanently removed from your listings.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-sm px-4 py-2 text-[13px] font-semibold text-[var(--text-muted)] transition hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-sm border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-semibold text-red-600 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  </>
);

const Profile = () => {
  const router = useRouter();
  // Matches the server-rendered default so hydration doesn't flash blank;
  // the effect below swaps in any locally-edited profile right after mount.
  const [profile, setProfile] = useState(dummyUser);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedPost, setSelectedPost] = useState(null);
  const [editing, setEditing] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  useEffect(() => {
    const storedProfile = getStoredUserProfile();
    setProfile(storedProfile);
    setUserPosts(getUserPosts(storedProfile.email));
  }, []);

  const tabCounts = useMemo(() => {
    const counts = { Active: 0, Draft: 0, Closed: 0, Expired: 0 };
    userPosts.forEach((post) => {
      const status = post.status || "Active";
      if (counts[status] !== undefined) counts[status] += 1;
    });
    return counts;
  }, [userPosts]);

  const filteredPosts = useMemo(
    () => userPosts.filter((post) => (post.status || "Active") === activeTab),
    [userPosts, activeTab],
  );

  const stats = useMemo(() => [
    { label: "Total posts",  value: userPosts.length,  icon: ClipboardList },
    { label: "Active posts", value: tabCounts.Active,  icon: CircleCheck },
    { label: "Joined posts", value: 0, icon: Handshake, hint: "Coming soon" },
    { label: "Saved posts",  value: 0, icon: Bookmark,  hint: "Coming soon" },
  ], [userPosts, tabCounts]);

  const refreshPosts = () => setUserPosts(getUserPosts(profile.email));

  const handleSaveProfile = (form) => {
    setProfile(updateUserProfile(form));
    setEditing(false);
  };

  const handleDelete = (id) => {
    deletePost(id);
    refreshPosts();
    setConfirmingDeleteId(null);
  };

  const emptyCopy = EMPTY_STATE_COPY[activeTab];

  return (
    <div className="space-y-5">

      <ProfileHeader profile={profile} onEditProfile={() => setEditing(true)} />

      <ProfileStats stats={stats} />

      {/* ── Posts ── */}
      <Card className="p-4 sm:p-5 md:p-6" hover={false}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">My Posts</p>
            <h2 className="mt-0.5 text-[18px] font-black text-[var(--text-heading)]">Manage your listings</h2>
          </div>

          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {POST_STATUSES.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex shrink-0 items-center gap-1.5 rounded-sm px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  activeTab === tab
                    ? "bg-[var(--text-heading)] text-[var(--selected-fg)]"
                    : "border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
                }`}
              >
                {tab}
                <span
                  className={`rounded-sm px-1.5 text-[10.5px] ${
                    activeTab === tab ? "bg-[var(--selected-fg)]/20" : "bg-[var(--bg-input)] text-[var(--text-faint)]"
                  }`}
                >
                  {tabCounts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <Inbox className="mb-3 h-12 w-12 text-[var(--text-faint)]" strokeWidth={1.75} />
            <p className="text-[15px] font-bold text-[var(--text-heading)]">{emptyCopy.title}</p>
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">{emptyCopy.desc}</p>
            {activeTab === "Active" && (
              <Button variant="yellow" size="sm" className="mt-4" onClick={() => router.push("/createpost")}>
                Create a post
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {filteredPosts.map((item) => (
              <div key={item.id} className="flex h-full flex-col gap-2">
                <div className="flex-1">
                  <PostItems post={item} onClick={() => setSelectedPost(item)} />
                </div>

                {/* action bar */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPost(item)}
                    className="flex-1 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-card)] py-2 text-[12px] font-semibold text-[var(--text-body)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/createpost?edit=${item.id}`)}
                    className="flex-1 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-card)] py-2 text-[12px] font-semibold text-[var(--text-body)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDeleteId(item.id)}
                    className="flex-1 rounded-sm border border-red-200 bg-red-50 py-2 text-[12px] font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AnimatePresence>
        {selectedPost && <PostModal key={selectedPost.id} post={selectedPost} onClose={() => setSelectedPost(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {editing && (
          <EditProfileModal profile={profile} onClose={() => setEditing(false)} onSave={handleSaveProfile} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmingDeleteId && (
          <ConfirmDeleteDialog
            onCancel={() => setConfirmingDeleteId(null)}
            onConfirm={() => handleDelete(confirmingDeleteId)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
