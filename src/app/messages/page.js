"use client";

import React from "react";
import { conversations } from "../../shared/conversations";
import MessagesLayout from "../../components/messages/MessagesLayout";
import ConversationList from "../../components/messages/ConversationList";

// Desktop: split pane with the first conversation active (WhatsApp Web style).
// Mobile: inbox only — no auto-redirect into a chat, the user taps a row.
const MessagesIndexPage = () => {
  const firstChat = conversations[0];

  return (
    <MessagesLayout
      activeChatId={firstChat.id}
      chat={firstChat}
      mobile={<ConversationList />}
    />
  );
};

export default MessagesIndexPage;
