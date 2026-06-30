"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  HiLocationMarker,
  HiOutlineCog,
  HiOutlinePencilAlt,
  HiOutlineUser,
} from "react-icons/hi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Data from "../shared/data";
import { dummyUser } from "../shared/dummyPosts";
import Button from "./ui/Button";
import Dropdown from "./ui/Dropdown";
import ThemeToggle from "./ui/ThemeToggle";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const profileMenuRef = useRef(null);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Posts", href: "/posts" },
  ];

  const activeCategory = searchParams.get("category") || "Nearby";

  const categoryOptions = useMemo(
    () => [{ name: "All categories", value: "Nearby" }, ...Data.CategoryData],
    [],
  );

  const glassSection = "theme-glass rounded-md";
  const isFeedPage = pathname === "/" || pathname === "/posts";
  const currentQuery = searchParams.get("q") || "";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchValue(currentQuery);
  }, [currentQuery, pathname]);

  const goTo = (href) => {
    setIsProfileOpen(false);
    router.push(href);
  };

  const goToCategory = (option) => {
    const category = option.value ?? option.name;
    const params = new URLSearchParams(searchParams.toString());

    if (category === "Nearby") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    const nextQuery = params.toString();
    setIsProfileOpen(false);
    router.push(nextQuery ? `/posts?${nextQuery}` : "/posts");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmedSearch = searchValue.trim();

    if (trimmedSearch) {
      params.set("q", trimmedSearch);
    } else {
      params.delete("q");
    }

    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-[999] border-b border-[var(--border-subtle)] bg-[rgb(var(--background-start-rgb))]/90 backdrop-blur">
      <div className="flex min-h-[76px] flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div
          className={`${glassSection} flex h-[52px] min-w-0 items-center gap-1 px-2 py-1 md:w-[260px]`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goTo("/")}
            className="min-w-0 rounded-md px-2 text-left hover:bg-transparent hover:opacity-90"
          >
              <span className="flex items-center gap-2">
                <span className="hidden text-base font-bold tracking-tight text-[var(--text-heading)] sm:block">
                  Plays
                </span>
                <span className="inline-flex rounded-xl bg-[var(--text-heading)] px-2 py-1 text-sm font-black uppercase tracking-[0.2em] text-[var(--bg-card)] shadow-sm">
                  GO
                </span>
            </span>
          </Button>

          <span className="hidden h-7 w-px shrink-0 bg-[var(--border-subtle)] md:block" />

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Button
                  key={href}
                  variant="ghost"
                  size="sm"
                  onClick={() => goTo(href)}
                  className={`px-4 font-medium ${
                    isActive
                      ? "theme-accent-fill shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
                  }`}
                >
                  {Icon && <Icon className="text-[18px]" />}
                  {label}
                </Button>
              );
            })}

            <Dropdown
              label="Categories"
              options={categoryOptions}
              value={activeCategory}
              onChange={goToCategory}
              active={pathname === "/posts" && activeCategory !== "Nearby"}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.value ?? option.name}
            />
          </nav>
        </div>

        <div className="flex w-full justify-center md:flex-1">
          <form
            onSubmit={handleSearchSubmit}
            className={`${glassSection} flex h-[52px] w-full max-w-2xl items-center gap-2 px-2 py-1`}
          >
            <div className="pointer-events-none flex h-10 w-10 items-center justify-center rounded-lg text-[var(--text-faint)]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" />
              </svg>
            </div>

            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search players, tutors, services, items..."
              className="h-10 w-full bg-transparent px-1 text-sm text-[var(--text-heading)] outline-none placeholder:text-[var(--text-faint)]"
            />

            <Button type="submit" size="sm" className="theme-accent-fill hover:opacity-90">
              Search
            </Button>
          </form>
        </div>

        <div
          className={`${glassSection} flex h-[52px] items-center gap-2 px-2 py-1 sm:gap-3`}
        >
          <div className="theme-muted-chip hidden items-center gap-2 rounded-xl px-3 py-2 text-sm sm:flex">
            <HiLocationMarker className="text-base text-[var(--text-muted)]" />
            <span className="max-w-[160px] truncate text-[var(--text-muted)]">
              Mumbai community
            </span>
          </div>

          <ThemeToggle />

          <Button
            variant="secondary"
            className="hidden sm:inline-flex"
            onClick={() => goTo("/createpost")}
          >
            <HiOutlinePencilAlt className="text-[18px]" />
          </Button>

          <div className="relative" ref={profileMenuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsProfileOpen((value) => !value)}
              className={`h-11 w-11 overflow-hidden rounded-md border p-[2px] ${
                isProfileOpen
                  ? "border-[var(--border-subtle)] bg-[var(--bg-input)]"
                  : "border-[var(--border-subtle)] hover:border-[var(--border-subtle)]"
              }`}
              title={dummyUser.name}
            >
              <Image
                src={dummyUser.image}
                alt="demo user"
                className="h-8 w-8 rounded-md object-cover"
                width={32}
                height={32}
              />
            </Button>

            {isProfileOpen && (
              <div className="theme-float absolute right-0 mt-3 w-64 overflow-hidden rounded-[20px] p-2 text-[var(--text-heading)]">
                <div className="border-b border-[var(--border-subtle)] px-3 py-2">
                  <p className="truncate text-sm font-semibold text-[var(--text-heading)]">
                    {dummyUser.name}
                  </p>
                  <p className="truncate text-xs text-[var(--text-faint)]">
                    @{dummyUser.username}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  className="mt-2 w-full justify-start rounded-xl px-3 text-[var(--text-body)] hover:text-[var(--text-heading)]"
                  onClick={() => goTo("/profile")}
                >
                  <HiOutlineUser className="text-[18px]" />
                  My profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-xl px-3 text-[var(--text-body)] hover:text-[var(--text-heading)]"
                  onClick={() => goTo("/createpost")}
                >
                  <HiOutlinePencilAlt className="text-[18px]" />
                  Create post
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-xl px-3 text-[var(--text-body)] hover:text-[var(--text-heading)]"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <HiOutlineCog className="text-[18px]" />
                  Settings
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
