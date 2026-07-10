import React from "react";

const MessageBubble = ({ from, text }) => (
  <div className={`flex ${from === "me" ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[75%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
        from === "me"
          ? "rounded-br-md bg-[var(--text-heading)] text-[var(--selected-fg)]"
          : "rounded-bl-md border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-body)]"
      }`}
    >
      {text}
    </div>
  </div>
);

export default MessageBubble;
