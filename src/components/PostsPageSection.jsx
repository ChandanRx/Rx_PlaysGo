"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Posts from "./HeroSection/Posts";
import CategoryModePrompt from "./CategoryModePrompt";
import { useClientSearchPosts, useStoredAppCategory } from "../hooks/useClientData";

const PostsPageSection = () => {
  const searchParams = useSearchParams();
  const searchText = searchParams.get("q") || "";
  const filter = searchParams.get("filter") || "Nearby";
  const { category, hasCategory, isReady: categoryReady } = useStoredAppCategory();

  const { posts, isReady: postsReady } = useClientSearchPosts(
    searchText,
    hasCategory ? category : "__none__",
  );

  const isReady = categoryReady && postsReady;

  return (
    <>
      <CategoryModePrompt />
      {hasCategory && (
        <Posts
          posts={posts}
          isReady={isReady}
          activeCategory={category}
          activeFilter={filter}
          searchText={searchText}
        />
      )}
    </>
  );
};

export default PostsPageSection;
