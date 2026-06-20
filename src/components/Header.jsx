"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  HiLocationMarker,
  HiOutlineCog,
  HiOutlinePencilAlt,
  HiOutlineSparkles,
  HiOutlineUser,
} from "react-icons/hi";
import { usePathname, useRouter } from "next/navigation";
import { dummyUser } from "../shared/dummyPosts";
import Button from "./ui/Button";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const navItems = [
    { label: "About", href: "/about" },
    { label: "Pro Version", href: "/pro", icon: HiOutlineSparkles },
    { label: "Pro Version", href: "/pro", icon: HiOutlineSparkles },
    { label: "Pro Version", href: "/pro", icon: HiOutlineSparkles },
  ];

  const glassSection =
    "rounded-md border border-[#89f336]/30 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_14px_40px_rgba(137,243,54,0.18)] backdrop-blur-xl";

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

  const goTo = (href) => {
    setIsProfileOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-[999]">
      <div className="mx-auto flex max-w-8xl items-center justify-between gap-4 px-4 py-3">
        <div className={`${glassSection} flex h-[52px] min-w-0 items-center gap-1 px-2 py-1`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goTo("/")}
            className="min-w-0 rounded-md px-2 text-left hover:bg-transparent hover:opacity-90"
          >
            <span className="flex items-center space-x-[0.5px]">
              <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#89f336] shadow-sm">
                <span
                  className="text-[17px] font-black leading-none text-zinc-950"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Q
                </span>
                <span className="absolute right-[6px] top-[6px] h-[5px] w-[5px] rounded-md bg-zinc-950" />
              </span>
              <span className="hidden text-base font-bold tracking-tight text-zinc-950 sm:block">
                uibly
              </span>
            </span>
          </Button>

          <span className="hidden h-7 w-px shrink-0 bg-[#89f336]/30 md:block" />

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Button
                  key={href}
                  variant="ghost"
                  size="sm"
                  onClick={() => goTo(href)}
                  className={`px-4 font-medium ${isActive
                      ? "bg-[#89f336] text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
                      : "text-zinc-700 hover:bg-yellow-100 hover:text-zinc-950"
                    }`}
                >
                  {Icon && <Icon className="text-[18px]" />}
                  {label}
                </Button>
              );
            })}
          </nav>
        </div>

        <div className={`${glassSection} flex h-[52px] items-center gap-2 px-2 py-1 sm:gap-3`}>
          <div className="hidden items-center gap-2 rounded-md bg-yellow-100 px-3 py-2 text-sm text-zinc-800 sm:flex">
            <HiLocationMarker className="text-base text-[#89f336]" />
            <span className="max-w-[140px] truncate">Mumbai, India</span>
          </div>

          <Button
            variant="secondary"
            className="hidden sm:inline-flex"
            onClick={() => goTo("/createpost")}
          >
            <HiOutlinePencilAlt className="text-[18px]" />
            <span>Create post</span>
          </Button>

          <div className="relative" ref={profileMenuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsProfileOpen((value) => !value)}
              className={`h-11 w-11 overflow-hidden rounded-md border p-[2px] ${isProfileOpen
                  ? "border-[#89f336] bg-yellow-100"
                  : "border-[#89f336]/40 hover:border-yellow-300"
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
              <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-md border border-[#89f336]/30 bg-white p-2 text-zinc-950 shadow-[0_18px_60px_rgba(137,243,54,0.22)]">
                <div className="border-b border-[#89f336]/20 px-3 py-2">
                  <p className="truncate text-sm font-semibold">
                    {dummyUser.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {dummyUser.email}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  className="mt-2 w-full justify-start rounded-md px-3 text-zinc-800"
                  onClick={() => goTo("/profile")}
                >
                  <HiOutlineUser className="text-[18px]" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-md px-3 text-zinc-800"
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