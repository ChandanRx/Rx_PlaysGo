"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import PostItems from "../../components/PostItems";
import { deletePost, dummyUser, getUserPosts } from "../../shared/dummyPosts";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Bookmark, Check, CircleCheck, ClipboardList, Handshake, Inbox } from "lucide-react";

const TABS = ["Active", "Draft", "Closed", "Expired"];

const Profile = () => {
  const [userPost, setUserPost]   = useState([]);
  const [activeTab, setActiveTab] = useState("Active");

  useEffect(() => { setUserPost(getUserPosts(dummyUser.email)); }, []);

  const stats = useMemo(() => [
    { label: "Total posts",  value: userPost.length, icon: ClipboardList },
    { label: "Active posts", value: userPost.length, icon: CircleCheck },
    { label: "Joined posts", value: 2,               icon: Handshake },
    { label: "Saved posts",  value: 7,               icon: Bookmark },
  ], [userPost]);

  const onDelete = (id) => { deletePost(id); setUserPost(getUserPosts(dummyUser.email)); };

  return (
    <div className="space-y-5">

      {/* ── Profile header ── */}
      <Card className="p-5 md:p-6" hover={false}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {/* avatar */}
            <div className="relative shrink-0">
              <Image
                src={dummyUser.image}
                alt={dummyUser.name}
                width={80} height={80}
                className="h-20 w-20 rounded-sm border-2 border-[var(--border-subtle)] object-cover"
              />
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#22C55E] text-white border-2 border-[var(--bg-card)]">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">User Profile</p>
              <h1 className="mt-0.5 text-[22px] font-black text-[var(--text-heading)]">{dummyUser.name}</h1>
              <p className="text-[13px] text-[var(--text-muted)]">@{dummyUser.username} · {dummyUser.city}</p>
              <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-[var(--text-body)]">{dummyUser.bio}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[dummyUser.email, dummyUser.mobile, `${dummyUser.city}, ${dummyUser.state}`].map((v) => (
                  <span key={v} className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-0.5 text-[11.5px] text-[var(--text-muted)]">{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Stats ── */}
      <div className="grid gap-3 md:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;

          return (
          <Card key={s.label} className="p-4" hover={false}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">{s.label}</p>
              <Icon className="h-5 w-5 text-[var(--brand)]" strokeWidth={2} />
            </div>
            <p className="mt-2 text-[28px] font-black leading-none text-[var(--text-heading)]">{s.value}</p>
          </Card>
          );
        })}
      </div>

      {/* ── Posts ── */}
      <Card className="p-5 md:p-6" hover={false}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">My Posts</p>
            <h2 className="mt-0.5 text-[18px] font-black text-[var(--text-heading)]">Manage your listings</h2>
          </div>
          <div className="flex gap-1.5">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  activeTab === tab
                    ? "bg-[var(--text-heading)] text-[var(--selected-fg)]"
                    : "border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {userPost.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <Inbox className="mb-3 h-12 w-12 text-[var(--text-faint)]" strokeWidth={1.75} />
            <p className="text-[15px] font-bold text-[var(--text-heading)]">No posts yet</p>
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">Create your first post to get started.</p>
            <Button variant="yellow" size="sm" className="mt-4" onClick={() => window.location.assign("/createpost")}>
              Create a post
            </Button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userPost.map((item) => (
              <div key={item.id} className="flex h-full flex-col gap-2">
                <div className="flex-1">
                  <PostItems post={item} />
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="w-full rounded-full border border-red-200 bg-red-50 py-2 text-[12px] font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Delete post
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
