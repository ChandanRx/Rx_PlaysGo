"use client";

import Image from "next/image";
import React from "react";
import { BellIcon } from "@heroicons/react/24/solid";
import {
  ArrowUturnLeftIcon, CheckBadgeIcon, ChatBubbleLeftIcon, SignalIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { dummyUser } from "../shared/dummyPosts";
import { useNotifications } from "../hooks/useClientData";
import { markAllNotificationsRead, markNotificationRead } from "../shared/notifications";

const ICONS = { reply: ArrowUturnLeftIcon, message: ChatBubbleLeftIcon, live: SignalIcon, badge: CheckBadgeIcon };

const RightSidebar = () => {
  const router = useRouter();
  const { notifications, unreadCount } = useNotifications();

  const handleSelect = (notification) => {
    markNotificationRead(notification.id);
    if (notification.href) router.push(notification.href);
  };

  return (
    <aside className="fixed right-4 top-4 bottom-4 z-30 hidden w-[300px] lg:flex">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-[0_1px_2px_rgba(28,32,18,0.04),0_12px_40px_rgba(28,32,18,0.06)]">

        {/* ── Profile header ── */}
        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-gradient-to-b from-[var(--bg-input)] to-[var(--bg-card)] px-5 pb-5 pt-5 text-left transition hover:bg-[var(--bg-input)]"
        >
          {/* decorative circles */}
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--border-subtle)] opacity-70" />
          <div className="absolute right-6 top-8 h-16 w-16 rounded-full bg-[var(--brand)]/10 opacity-80" />

          <div className="relative mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-[3px] border-[var(--bg-card)] shadow-md">
            <Image src={dummyUser.image} alt={dummyUser.name} width={64} height={64} unoptimized={dummyUser.image?.startsWith("data:")} className="h-full w-full object-cover" />
          </div>
          <h2 className="relative mt-3 text-center text-[15px] font-bold text-[var(--text-heading)]">{dummyUser.name}</h2>
          <p className="relative text-center text-[12px] text-[var(--text-muted)]">@{dummyUser.username} · Mumbai</p>
        </button>

        {/* ── Notifications ── */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
            <h3 className="text-[13px] font-bold text-[var(--text-heading)]">Notifications</h3>
            <div className="flex items-center gap-2.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllNotificationsRead()}
                  className="text-[11px] font-semibold text-[var(--brand)] transition hover:text-[var(--brand-hover)]"
                >
                  Mark all read
                </button>
              )}
              <BellIcon className="h-[18px] w-[18px] text-[var(--brand)]" />
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-2">
            {notifications.length === 0 ? (
              <p className="px-2 py-8 text-center text-[12.5px] text-[var(--text-muted)]">No notifications yet</p>
            ) : (
              notifications.map((notification) => {
                const Icon = ICONS[notification.icon] || BellIcon;
                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleSelect(notification)}
                    className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 hover:bg-[var(--bg-input)] ${
                      !notification.read ? "bg-[var(--brand-soft)]/40" : ""
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]">
                      <Icon className="h-4 w-4" strokeWidth={2.25} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-semibold text-[var(--text-heading)]">
                        {notification.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-[var(--text-faint)]">{notification.time}</span>
                    </span>
                    {!notification.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
