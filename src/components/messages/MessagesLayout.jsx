"use client";

import React from "react";
import ConversationList from "./ConversationList";
import ChatPanel from "./ChatPanel";

// Shared WhatsApp-Web-style split pane for desktop (list + active chat side by
// side in one row). Mobile gets whichever single screen the caller supplies —
// the inbox list on /messages, the full chat on /messages/[chatId].
const MessagesLayout = ({ activeChatId, chat, post, mobile }) => (
  <div className="flex h-full min-h-0 flex-1 flex-col lg:flex-row">
    {/* Desktop — left panel: compact conversation list */}
    <div className="hidden h-full w-[320px] shrink-0 flex-col border-r border-[var(--border-subtle)] lg:flex">
      <ConversationList activeChatId={activeChatId} />
    </div>

    {/* Desktop — right panel: active chat */}
    <div className="hidden h-full min-h-0 flex-1 flex-col lg:flex">
      <ChatPanel chat={chat} post={post} />
    </div>

    {/* Mobile — single screen (inbox or chat, decided by the page) */}
    <div className="flex h-full min-h-0 flex-1 flex-col lg:hidden">
      {mobile}
    </div>
  </div>
);

export default MessagesLayout;
