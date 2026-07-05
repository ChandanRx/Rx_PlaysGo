"use client";

import { useEffect, useState } from "react";
import { searchPosts } from "../shared/dummyPosts";
import {
  CATEGORY_CHANGE_EVENT,
  getStoredAppCategory,
} from "../shared/appPreferences";
import {
  NOTIFICATIONS_CHANGE_EVENT,
  getNotifications,
} from "../shared/notifications";

export const useClientSearchPosts = (searchText = "", category = "", enabled = true) => {
  const [posts, setPosts] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setPosts(searchPosts(searchText, category));
    setIsReady(true);
  }, [searchText, category, enabled]);

  return { posts, isReady };
};

export const useStoredAppCategory = () => {
  const [category, setCategory] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncCategory = () => {
      setCategory(getStoredAppCategory());
      setIsReady(true);
    };

    syncCategory();
    window.addEventListener(CATEGORY_CHANGE_EVENT, syncCategory);
    return () => window.removeEventListener(CATEGORY_CHANGE_EVENT, syncCategory);
  }, []);

  return { category, isReady, hasCategory: Boolean(category) };
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setNotifications(getNotifications());
      setIsReady(true);
    };

    sync();
    window.addEventListener(NOTIFICATIONS_CHANGE_EVENT, sync);
    return () => window.removeEventListener(NOTIFICATIONS_CHANGE_EVENT, sync);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, isReady };
};

export const useClientGreeting = () => {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return greeting;
};
