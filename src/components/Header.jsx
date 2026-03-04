"use client"
import Image from 'next/image';
import React from 'react'
import logo from '../../assets/Images/logoX.png'
const USER_IMG = 'https://img.jagranjosh.com/imported/images/E/GK/dhoni-records-odi.webp'
import { HiOutlinePencilAlt } from "react-icons/hi";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
<header className="sticky top-0 z-[999]">
  <div className="mx-auto flex w-[76%] items-center justify-between overflow-hidden rounded-2xl border border-white/10 bg-black/40 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur md:px-6">

{/* Logo */}
<button
  onClick={() => router.push('/')}
  className="flex items-center gap-2 rounded-lg px-1 py-1 text-left outline-none transition hover:opacity-90"
>
  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
    Plays
  </span>
  <span className="rounded-md bg-amber-400 px-2 py-1 text-xs font-bold tracking-wide text-slate-950 shadow-sm">
    GO
  </span>
</button>

{/* Right Side Buttons */}
<div className="flex items-center gap-3">

  {/* Create Post Button - desktop */}
  <button
    className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-slate-100 shadow-sm transition hover:border-amber-400/60 hover:bg-white/5"
    onClick={() => router.push('/createpost')}
  >
    <HiOutlinePencilAlt className="text-[18px]" />
    <span>Create post</span>
  </button>

  {/* Create Post - mobile icon */}
  <button
    className="inline-flex sm:hidden items-center justify-center rounded-full border border-white/10 bg-transparent p-2 text-slate-100 shadow-sm transition hover:border-amber-400/60 hover:bg-white/5"
    onClick={() => router.push('/createpost')}
  >
    <HiOutlinePencilAlt className="text-[18px]" />
  </button>

  {/* Sign In / Sign Out Button */}
  {!session ? (
    <button
      className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md transition hover:bg-amber-300"
      onClick={() => signIn("google")}
    >
      <span className="hidden sm:block">Sign in</span>
      <HiArrowLeftOnRectangle className="sm:hidden text-[18px]" />
    </button>
  ) : (
    <button
   className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-slate-100 shadow-sm transition hover:border-red-400/70 hover:bg-white/5 hover:text-red-200"
      onClick={() => signOut()}
    >
      <span className="hidden sm:block">Sign out</span>
      <HiArrowLeftOnRectangle className="sm:hidden text-[18px]" />
    </button>
  )}

  {/* User Image */}
  {session && (
    <button
      onClick={() => router.push('/profile')}
      className="ml-1 inline-flex items-center justify-center rounded-full border border-white/10 p-[2px] transition hover:border-amber-400/70"
    >
      <Image
        src={session?.user?.image || USER_IMG}
        alt="user image"
        className="h-9 w-9 rounded-full object-cover"
        width={36}
        height={36}
      />
    </button>
  )}
</div>
</div>
</header>

  )
}

export default Header;