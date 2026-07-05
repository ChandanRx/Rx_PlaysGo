"use client";

import React, { Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getConversationForChatId } from "../../../shared/conversations";
import { getPostById } from "../../../shared/dummyPosts";
import MessagesLayout from "../../../components/messages/MessagesLayout";
import ChatPanel from "../../../components/messages/ChatPanel";

const ChatRoute = () => {
  const router = useRouter();
  const { chatId } = useParams();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const post = postId ? getPostById(postId) : null;
  const chat = getConversationForChatId(chatId, post?.userName);

  return (
    <MessagesLayout
      activeChatId={chat.id}
      chat={chat}
      post={post}
      mobile={
        <ChatPanel chat={chat} post={post} showBack onBack={() => router.push("/messages")} />
      }
    />
  );
};

const ChatRouteWithSuspense = () => (
  <Suspense fallback={null}>
    <ChatRoute />
  </Suspense>
);

export default ChatRouteWithSuspense;
