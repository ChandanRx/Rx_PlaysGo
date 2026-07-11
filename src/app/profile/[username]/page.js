"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { ArrowLeftIcon, InboxIcon } from "@heroicons/react/24/outline";
import { staggerContainer, staggerItem } from "../../../shared/motionPresets";
import PostItems from "../../../components/PostItems";
import PostModal from "../../../components/PostModal";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import FollowListModal from "../../../components/profile/FollowListModal";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import {
  CURRENT_USER_ID,
  FOLLOW_CHANGE_EVENT,
  followUser,
  getUserByUsername,
  getUserPosts,
  isFollowing,
  unfollowUser,
} from "../../../shared/dummyPosts";

const UserProfile = () => {
  const router = useRouter();
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [followList, setFollowList] = useState(null);

  const isOwnProfile = profile?.id === CURRENT_USER_ID;

  useEffect(() => {
    const load = () => {
      const user = getUserByUsername(username);
      if (!user) {
        setNotFound(true);
        setProfile(null);
        return;
      }

      setNotFound(false);
      setProfile(user);
      setUserPosts(
        getUserPosts(user.email).filter(
          (post) => (post.status || "Active") === "Active",
        ),
      );
      setFollowing(isFollowing(CURRENT_USER_ID, user.id));
    };

    load();
    window.addEventListener(FOLLOW_CHANGE_EVENT, load);
    return () => window.removeEventListener(FOLLOW_CHANGE_EVENT, load);
  }, [username]);

  const handleToggleFollow = () => {
    if (!profile) return;
    if (following) unfollowUser(CURRENT_USER_ID, profile.id);
    else followUser(CURRENT_USER_ID, profile.id);
  };

  if (notFound) {
    return (
      <div className="mx-auto max-w-md">
        <Card className="flex flex-col items-center p-8 text-center" hover={false} padding={false}>
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-faint)]">
            <InboxIcon className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <p className="text-[15px] font-bold text-[var(--text-heading)]">User not found</p>
          <p className="mt-1 text-[13px] text-[var(--text-muted)]">
            We couldn&apos;t find a profile for @{username}.
          </p>
          <Button variant="yellow" size="sm" className="mt-5" onClick={() => router.back()}>
            Go back
          </Button>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

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

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 text-[13px] font-semibold text-[var(--text-muted)] shadow-[var(--shadow-xs)] transition hover:text-[var(--text-heading)]"
      >
        <ArrowLeftIcon className="h-4 w-4" strokeWidth={2.25} />
        Back
      </button>

      <ProfileHeader
        profile={profile}
        stats={stats}
        isOwnProfile={isOwnProfile}
        onEditProfile={() => router.push("/profile")}
        following={following}
        onToggleFollow={handleToggleFollow}
        onGetInTouch={() => router.push("/messages")}
      />

      <Card className="p-4 sm:p-5 md:p-6" hover={false} padding={false}>
        <div className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Public posts
          </p>
          <h2 className="text-[18px] font-black text-[var(--text-heading)]">
            {isOwnProfile ? "Your active posts" : `${profile.name.split(" ")[0]}'s active posts`}
          </h2>
        </div>

        {userPosts.length === 0 ? (
          <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-secondary)]/60 px-5 py-12 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-card)] text-[var(--text-faint)] shadow-[var(--shadow-xs)]">
              <InboxIcon className="h-7 w-7" strokeWidth={1.75} />
            </span>
            <p className="text-[15px] font-bold text-[var(--text-heading)]">No posts yet</p>
            <p className="mt-1 max-w-sm text-[13px] text-[var(--text-muted)]">
              This user hasn&apos;t shared any public posts.
            </p>
          </div>
        ) : (
          <m.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
          >
            {userPosts.map((item) => (
              <m.div key={item.id} variants={staggerItem} className="h-full">
                <PostItems post={item} onClick={() => setSelectedPost(item)} />
              </m.div>
            ))}
          </m.div>
        )}
      </Card>

      <AnimatePresence>
        {selectedPost && (
          <PostModal key={selectedPost.id} post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {followList && (
          <FollowListModal
            title={followList === "followers" ? "Followers" : "Following"}
            userIds={followList === "followers" ? profile.followers : profile.following}
            onClose={() => setFollowList(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
