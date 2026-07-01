"use client";

import { useEffect, useState } from "react";
import { searchPosts } from "../shared/dummyPosts";
import {
  CATEGORY_CHANGE_EVENT,
  getStoredAppCategory,
} from "../shared/appPreferences";

export const useClientSearchPosts = (searchText = "", category = "") => {
  const [posts, setPosts] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setPosts(searchPosts(searchText, category));
    setIsReady(true);
  }, [searchText, category]);

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
