"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { conversations } from "../../shared/conversations";
import { getAvatarForUserName } from "../../shared/dummyPosts";

const ConversationList = ({ activeChatId }) => {
  const router = useRouter();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
        <h1 className="text-[15px] font-bold text-[var(--text-heading)] lg:text-[13px]">Messages</h1>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-2 lg:px-3">
        {conversations.map((chat) => {
          const active = chat.id === activeChatId;
          const avatar = getAvatarForUserName(chat.name);
          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => router.push(`/messages/${chat.id}`)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 ${
                active ? "bg-[var(--selected-bg)] text-[var(--selected-fg)]" : "hover:bg-[var(--bg-input)]"
              }`}
            >
              <div
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold ${
                  active ? "bg-[var(--bg-card)] text-[var(--text-heading)]" : "bg-[var(--bg-input)] text-[var(--text-body)]"
                }`}
              >
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={chat.name}
                    width={44}
                    height={44}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  chat.name[0]
                )}
                {chat.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-card)] bg-[#22C55E]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`truncate text-[13px] font-semibold ${active ? "text-[var(--selected-fg)]" : "text-[var(--text-heading)]"}`}>
                    {chat.name}
                  </span>
                  <span className={`shrink-0 text-[10px] ${active ? "text-[var(--selected-fg)]/60" : "text-[var(--text-faint)]"}`}>
                    {chat.time}
                  </span>
                </div>
                <p className={`truncate text-[12px] ${active ? "text-[var(--selected-fg)]/90" : "text-[var(--text-body)]"}`}>
                  {chat.preview}
                </p>
              </div>
              {chat.unread > 0 && (
                <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[var(--brand)] px-1.5 text-[10px] font-bold text-[var(--on-brand)]">
                  {chat.unread}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
