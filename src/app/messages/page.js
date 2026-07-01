"use client";

import React, { useState } from "react";
import { HiChatAlt2, HiMicrophone, HiOutlineChevronRight } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { dummyUser } from "../../shared/dummyPosts";

const conversations = [
  { id: "riya",  name: "Riya Kapoor",  preview: "Court is booked for 7:30.", time: "2m",  unread: 2, online: true,  messages: [{ from: "them", text: "Are you free for Sunday cricket?" }, { from: "me", text: "Yes! What time works?" }, { from: "them", text: "7:30 AM at Shivaji Park" }] },
  { id: "priya", name: "Priya Nair",   preview: "Can you help on Saturday?",  time: "18m", unread: 1, online: true,  messages: [{ from: "them", text: "Can you help on Saturday?" }, { from: "me", text: "Sure, what do you need?" }] },
  { id: "kabir", name: "Kabir Singh",  preview: "Desk is still available.",   time: "1h",  unread: 0, online: false, messages: [{ from: "them", text: "Desk is still available for pickup." }] },
  { id: "neha",  name: "Neha Joshi",   preview: "Interested in the desk?",    time: "3h",  unread: 0, online: false, messages: [{ from: "them", text: "Interested in the study desk?" }] },
];

const MessagesPage = () => {
  const router = useRouter();
  const [activeChatId, setActiveChatId] = useState("riya");
  const [message, setMessage] = useState("");
  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-heading)]">Messages</h1>
          <p className="text-xs text-[var(--text-muted)]">Chat with your connections</p>
        </div>
        <HiChatAlt2 className="text-[18px] text-[var(--brand)]" />
      </div>

      {/* Chat layout */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
        {/* Chat list */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="max-h-[240px] space-y-1 overflow-y-auto border-b border-[var(--border-subtle)] px-4 py-3">
            {conversations.map((chat) => {
              const active = chat.id === activeChatId;
              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                    active ? "bg-[var(--text-heading)] text-[var(--bg-card)]" : "hover:bg-[var(--bg-input)]"
                  }`}
                >
                  <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    active ? "bg-[var(--bg-card)] text-[var(--text-heading)]" : "bg-[var(--bg-input)] text-[var(--text-body)]"
                  }`}>
                    {chat.name[0]}
                    {chat.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-card)] bg-[#22C55E]" />}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className={`truncate text-[13px] font-semibold ${active ? "text-[var(--bg-card)]" : "text-[var(--text-heading)]"}`}>{chat.name}</span>
                      <span className={`text-[10px] ${active ? "text-[var(--bg-card)]/60" : "text-[var(--text-faint)]"}`}>{chat.time}</span>
                    </div>
                    <p className={`truncate text-[11px] ${active ? "text-[var(--bg-card)]/70" : "text-[var(--text-muted)]"}`}>{chat.preview}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--brand)] px-1.5 text-[10px] font-bold text-white">{chat.unread}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Chat window */}
          <div className="flex min-h-0 flex-1 flex-col px-4 py-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-[var(--text-heading)]">{activeChat.name}</h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {activeChat.online ? <span className="font-medium text-[#22C55E]">● Online</span> : "Offline"}
                </p>
              </div>
              <button className="rounded-xl p-1.5 text-[var(--text-faint)] transition hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]">
                <HiOutlineChevronRight className="text-[18px]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {activeChat.messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                    msg.from === "me"
                      ? "rounded-br-sm bg-[var(--text-heading)] text-[var(--bg-card)]"
                      : "rounded-bl-sm border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-body)]"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-4 py-3"
              onSubmit={(e) => { e.preventDefault(); if (!message.trim()) return; setMessage(""); }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message…"
                className="flex-1 bg-transparent text-[13px] text-[var(--text-body)] outline-none placeholder:text-[var(--text-faint)]"
              />
              <button
                type="button"
                aria-label="Voice message"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand)] text-white transition hover:bg-[var(--brand-hover)]"
              >
                <HiMicrophone className="text-[15px]" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
