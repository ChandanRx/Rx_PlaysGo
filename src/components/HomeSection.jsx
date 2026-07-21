"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Posts from "./HeroSection/Posts";
import CategoryModePrompt from "./CategoryModePrompt";
import { useClientSearchPosts, useStoredAppCategory } from "../hooks/useClientData";

const HomeSection = () => {
  const searchParams = useSearchParams();
  const searchText = searchParams.get("q") || "";
  const filter = searchParams.get("filter") || "Nearby";
  const sport = searchParams.get("sport") || "";
  const { category, hasCategory, isReady: categoryReady } = useStoredAppCategory();

  const { posts, isReady: postsReady } = useClientSearchPosts(
    searchText,
    category,
    categoryReady && hasCategory,
  );

  // Sport filter narrows the feed to a single game (post.subCategory), using
  // the same values the create-post form writes.
  const visiblePosts = sport
    ? posts.filter((post) => (post.subCategory || "").toLowerCase() === sport.toLowerCase())
    : posts;

  const isReady = categoryReady && postsReady;

  return (
    <>
      <CategoryModePrompt />
      {hasCategory && (
        <Posts
          posts={visiblePosts}
          isReady={isReady}
          activeCategory={category}
          activeFilter={filter}
          activeSport={sport}
          searchText={searchText}
        />
      )}
    </>
  );
};

export default HomeSection;
