"use client"
import React, { useEffect, useState } from 'react';
import Hero from './HeroSection/Hero';
import Search from './HeroSection/Search';
import GameList from './HeroSection/GameList';
import Posts from './HeroSection/Posts';
import { getPosts, searchPosts } from '../shared/dummyPosts';

const HomeSection = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const handleSearch = (searchText) => {
    setPosts(searchPosts(searchText));
  };

  return (
    <main className="mt-10 px-3 sm:px-4">
      <div className="mx-auto max-w-8xl space-y-10">
        <Hero />
        <Search onSearch={handleSearch} />
        <GameList />
        <Posts posts={posts} />
      </div>
    </main>
  );
};

export default HomeSection;
