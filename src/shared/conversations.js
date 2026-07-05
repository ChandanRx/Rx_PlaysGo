export const conversations = [
  { id: "riya",  name: "Riya Kapoor",  preview: "Court is booked for 7:30.", time: "2m",  unread: 2, online: true,  messages: [{ from: "them", text: "Are you free for Sunday cricket?" }, { from: "me", text: "Yes! What time works?" }, { from: "them", text: "7:30 AM at Shivaji Park" }] },
  { id: "priya", name: "Priya Nair",   preview: "Can you help on Saturday?",  time: "18m", unread: 1, online: true,  messages: [{ from: "them", text: "Can you help on Saturday?" }, { from: "me", text: "Sure, what do you need?" }] },
  { id: "kabir", name: "Kabir Singh",  preview: "Desk is still available.",   time: "1h",  unread: 0, online: false, messages: [{ from: "them", text: "Desk is still available for pickup." }] },
  { id: "neha",  name: "Neha Joshi",   preview: "Interested in the desk?",    time: "3h",  unread: 0, online: false, messages: [{ from: "them", text: "Interested in the study desk?" }] },
];

export const slugify = (value = "") =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const findConversation = (chatId) =>
  conversations.find((c) => c.id === chatId);

export const getChatIdForUserName = (userName = "") => {
  const slug = slugify(userName);
  const existing = conversations.find((c) => c.id === slug || slugify(c.name) === slug);
  return existing ? existing.id : slug || "new";
};

// Falls back to a stub conversation (no history yet) when chatId doesn't
// match one of the seeded conversations — e.g. deep-linking from a post
// whose author isn't one of the dummy contacts.
export const getConversationForChatId = (chatId, fallbackName) => {
  const existing = findConversation(chatId);
  if (existing) return existing;

  return {
    id: chatId,
    name: fallbackName || "New chat",
    preview: "",
    time: "",
    unread: 0,
    online: false,
    messages: [],
  };
};
