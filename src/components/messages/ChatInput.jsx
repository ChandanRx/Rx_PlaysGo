"use client";

import React, { useState } from "react";
import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { m, AnimatePresence } from "framer-motion";
import { popIn } from "../../shared/motionPresets";

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const hasText = message.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setMessage("");
  };

  return (
    <form
      className="flex shrink-0 items-center gap-3 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message…"
        className="flex-1 rounded-full bg-[var(--bg-input)] px-3.5 py-2.5 text-[13px] text-[var(--text-body)] outline-none focus-visible:shadow-none placeholder:text-[var(--text-faint)]"
      />

      {/* Send when there's text, mic when empty — swapped with a small pop. */}
      <div className="relative h-9 w-9 shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {hasText ? (
            <m.button
              key="send"
              {...popIn}
              type="submit"
              aria-label="Send message"
              className="absolute inset-0 flex items-center justify-center rounded-full bg-[var(--brand)] text-[var(--on-brand)] transition hover:bg-[var(--brand-hover)]"
            >
              <PaperAirplaneIcon className="h-[15px] w-[15px] -rotate-45" />
            </m.button>
          ) : (
            <m.button
              key="mic"
              {...popIn}
              type="button"
              aria-label="Voice message"
              className="absolute inset-0 flex items-center justify-center rounded-full bg-[var(--brand)] text-[var(--on-brand)] transition hover:bg-[var(--brand-hover)]"
            >
              <MicrophoneIcon className="h-[15px] w-[15px]" />
            </m.button>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};

export default ChatInput;
