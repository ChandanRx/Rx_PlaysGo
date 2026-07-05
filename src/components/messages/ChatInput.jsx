"use client";

import React, { useState } from "react";
import { HiMicrophone } from "react-icons/hi";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  return (
    <form
      className="flex shrink-0 items-center gap-3 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3"
      onSubmit={(e) => { e.preventDefault(); if (!message.trim()) return; setMessage(""); }}
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message…"
        className="flex-1 rounded-sm bg-[var(--bg-input)] px-3.5 py-2.5 text-[13px] text-[var(--text-body)] outline-none focus-visible:shadow-none placeholder:text-[var(--text-faint)]"
      />
      <button
        type="button"
        aria-label="Voice message"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-white transition hover:bg-[var(--brand-hover)]"
      >
        <HiMicrophone className="text-[15px]" />
      </button>
    </form>
  );
};

export default ChatInput;
