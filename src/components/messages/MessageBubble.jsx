import React from "react";
import { m } from "framer-motion";
import { chatBubbleIn } from "../../shared/motionPresets";

const MessageBubble = ({ from, text }) => (
  <m.div
    variants={chatBubbleIn}
    initial="hidden"
    animate="show"
    className={`flex ${from === "me" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-[75%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
        from === "me"
          ? "rounded-br-md bg-[var(--text-heading)] text-[var(--bg-card)]"
          : "rounded-bl-md border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-body)]"
      }`}
    >
      {text}
    </div>
  </m.div>
);

export default MessageBubble;
