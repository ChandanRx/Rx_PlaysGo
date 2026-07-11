"use client";

import React from "react";
import Link from "next/link";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { getUsernameForUserName } from "../../shared/dummyPosts";

const ChatPanel = ({ chat, post, showBack = false, onBack }) => {
  const authorUsername = chat ? getUsernameForUserName(chat.name) : null;

  if (!chat) {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <ChatBubbleLeftRightIcon className="h-[32px] w-[32px] text-[var(--text-faint)]" />
        <p className="text-[13px] text-[var(--text-muted)]">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      {/* header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversations"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--text-heading)] transition hover:bg-[var(--bg-input)]"
          >
            <ArrowLeftIcon className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </button>
        )}

        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--bg-input)] text-sm font-bold text-[var(--text-body)]">
          {chat.name[0]}
          {chat.online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-card)] bg-[#22C55E]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {authorUsername ? (
            <Link
              href={`/profile/${authorUsername}`}
              className="block truncate text-[15px] font-bold text-[var(--text-heading)] hover:underline"
            >
              {chat.name}
            </Link>
          ) : (
            <h3 className="truncate text-[15px] font-bold text-[var(--text-heading)]">{chat.name}</h3>
          )}
          <p className="text-[11px] text-[var(--text-muted)]">
            {chat.online ? <span className="font-medium text-[#22C55E]">● Online</span> : "Offline"}
          </p>
          {post && (
            <p className="mt-0.5 truncate text-[11px] font-medium text-[var(--brand)]">Re: {post.title}</p>
          )}
        </div>
      </div>

      {/* messages */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {chat.messages.length === 0 ? (
          <p className="text-[12.5px] text-[var(--text-faint)]">Say hello to start the conversation.</p>
        ) : (
          chat.messages.map((msg, i) => <MessageBubble key={i} from={msg.from} text={msg.text} />)
        )}
      </div>

      {/* input */}
      <ChatInput />
    </div>
  );
};

export default ChatPanel;
