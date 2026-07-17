"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import {
  EyeIcon,
  InboxIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { springSnappy, staggerContainer, staggerItem } from "../../shared/motionPresets";
import PostItems from "../../components/PostItems";
import PostModal from "../../components/PostModal";
import ProfileHeader from "../../components/profile/ProfileHeader";
import FollowListModal from "../../components/profile/FollowListModal";
import EditProfileModal from "../../components/profile/EditProfileModal";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  CURRENT_USER_ID,
  FOLLOW_CHANGE_EVENT,
  POST_STATUSES,
  deletePost,
  dummyUser,
  getStoredUserProfile,
  getUserById,
  getUserPosts,
  updateUserProfile,
} from "../../shared/dummyPosts";

const EMPTY_STATE_COPY = {
  Active: { title: "No posts yet", desc: "Create your first post to get started." },
  Draft: { title: "No drafts saved", desc: "Posts you save as drafts will show up here." },
  Closed: { title: "No closed posts", desc: "Posts you mark as closed will show up here." },
  Expired: { title: "No expired posts", desc: "Posts past their date will show up here." },
};

const Profile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState(dummyUser);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedPost, setSelectedPost] = useState(null);
  const [editing, setEditing] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [followList, setFollowList] = useState(null);

  useEffect(() => {
    const load = () => {
      const me = getUserById(CURRENT_USER_ID) || getStoredUserProfile();
      setProfile(me);
      setUserPosts(getUserPosts(me.email));
    };

    load();
    // Keep follower / following counts live when follow state changes anywhere.
    window.addEventListener(FOLLOW_CHANGE_EVENT, load);
    return () => window.removeEventListener(FOLLOW_CHANGE_EVENT, load);
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

  const refreshPosts = () => setUserPosts(getUserPosts(profile.email));

  const handleSaveProfile = (form) => {
    updateUserProfile(form);
    setProfile(getUserById(CURRENT_USER_ID) || getStoredUserProfile());
    setEditing(false);
  };

  const stats = [
    {
      label: "Followers",
      value: profile.followers?.length ?? 0,
      onClick: () => setFollowList("followers"),
    },
    {
      label: "Following",
      value: profile.following?.length ?? 0,
      onClick: () => setFollowList("following"),
    },
    { label: "Posts", value: userPosts.length },
  ];

  const handleDelete = (id) => {
    deletePost(id);
    refreshPosts();
    setConfirmingDeleteId(null);
  };

  const emptyCopy = EMPTY_STATE_COPY[activeTab];

  return (
    <div className="space-y-5">
      <ProfileHeader
        profile={profile}
        stats={stats}
        onEditProfile={() => setEditing(true)}
      />

      <Card className="p-4 sm:p-5 md:p-6" hover={false} padding={false}>
        <div className="flex flex-col gap-3 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Post center
            </p>
            <h2 className="mt-1 text-[18px] font-black text-[var(--text-heading)]">Manage your posts</h2>
          </div>

          <Button variant="yellow" size="md" className="w-full sm:w-auto" onClick={() => router.push("/createpost")}>
            <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
            New post
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-1 scrollbar-none">
          <div className="flex min-w-max gap-1">
            {POST_STATUSES.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative inline-flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-[13px] font-bold transition-colors ${
                  activeTab === tab
                    ? "text-[var(--text-heading)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                }`}
              >
                {activeTab === tab && (
                  <m.span
                    layoutId="profile-tab-pill"
                    transition={springSnappy}
                    className="absolute inset-0 rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-xs)]"
                  />
                )}
                <span className="relative z-10">{tab}</span>
                <span className={`relative z-10 rounded-full px-2 py-0.5 text-[10px] font-black ${
                  activeTab === tab
                    ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                    : "bg-[var(--bg-card)] text-[var(--text-faint)]"
                }`}>
                  {tabCounts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-secondary)]/60 px-5 py-12 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-card)] text-[var(--text-faint)] shadow-[var(--shadow-xs)]">
              <InboxIcon className="h-7 w-7" strokeWidth={1.75} />
            </span>
            <p className="text-[15px] font-bold text-[var(--text-heading)]">{emptyCopy.title}</p>
            <p className="mt-1 max-w-sm text-[13px] text-[var(--text-muted)]">{emptyCopy.desc}</p>
            {activeTab === "Active" && (
              <Button variant="yellow" size="sm" className="mt-5" onClick={() => router.push("/createpost")}>
                <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                Create a post
              </Button>
            )}
          </div>
        ) : (
          <m.div
            key={activeTab}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
          >
            {filteredPosts.map((item) => (
              <m.div key={item.id} variants={staggerItem} className="flex h-full flex-col gap-2">
                <div className="flex-1">
                  <PostItems post={item} onClick={() => setSelectedPost(item)} />
                </div>

                <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-1.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-1">
                  <button
                    type="button"
                    onClick={() => setSelectedPost(item)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--bg-card)] py-2 text-[12px] font-semibold text-[var(--text-body)] shadow-[var(--shadow-xs)] transition hover:text-[var(--text-heading)] active:scale-[0.97]"
                  >
                    <EyeIcon className="h-3.5 w-3.5" strokeWidth={2} />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/createpost?edit=${item.id}`)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--bg-card)] py-2 text-[12px] font-semibold text-[var(--text-body)] shadow-[var(--shadow-xs)] transition hover:text-[var(--brand)] active:scale-[0.97]"
                  >
                    <PencilSquareIcon className="h-3.5 w-3.5" strokeWidth={2} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDeleteId(item.id)}
                    aria-label="Delete post"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--danger-soft)] text-[var(--danger)] transition hover:ring-1 hover:ring-[var(--danger)] active:scale-[0.97]"
                  >
                    <TrashIcon className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
              </m.div>
            ))}
          </m.div>
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
          <ConfirmDialog
            title="Delete this post?"
            description="This can't be undone. The post will be permanently removed from your listings."
            onCancel={() => setConfirmingDeleteId(null)}
            onConfirm={() => handleDelete(confirmingDeleteId)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {followList && (
          <FollowListModal
            ownerId={profile.id}
            type={followList}
            onClose={() => setFollowList(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
