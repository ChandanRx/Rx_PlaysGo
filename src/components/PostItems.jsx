"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  HiBadgeCheck, HiHeart, HiOutlineHeart,
  HiLocationMarker, HiOutlineCalendar,
  HiOutlineChatAlt2, HiOutlineUserAdd,
  HiStar, HiClock, HiUsers, HiTag,
} from "react-icons/hi";
import { motion } from "framer-motion";

/* ── helpers ── */
const getCategoryThemeClass = (c) => {
  if (c === "Players")    return "category-theme--players";
  if (c === "Local Help") return "category-theme--local-help";
  if (c === "For Sale")   return "category-theme--for-sale";
  return "";
};

const EMOJI = {
  Cricket:"🏏",Football:"⚽",Volleyball:"🏐",Badminton:"🏸",Tennis:"🎾",Basketball:"🏀",
  Tutor:"📚",Maths:"📐",Design:"🎨","Moving Help":"📦","House Help":"🏠",Driver:"🚗",
  "Event Volunteer":"🙌",Freelancer:"💼","Travel Partner":"✈️","Shared Apartment":"🛋️",
  Electronics:"💻",Furniture:"🪑",Vehicles:"🚘",Books:"📖","Sports Equipment":"🏋️",
};

const getMetaText = (post) => {
  if (!post?.requiredPeople) return null;
  if (post.category === "For Sale")   return `₹ ${post.requiredPeople}`;
  if (post.category === "Local Help") return `${post.requiredPeople} Helpers`;
  return `${post.requiredPeople} Players`;
};

const getPrimaryLabel = (category) => {
  if (category === "For Sale")   return "View Details";
  if (category === "Local Help") return "Request Help";
  return "Join Now";
};

const getChips = (post) => {
  const chips = [];
  if (post?.subCategory)    chips.push({ icon: HiTag,            label: post.subCategory });
  if (post?.requiredPeople) chips.push({ icon: HiUsers,          label: getMetaText(post) });
  if (post?.duration)       chips.push({ icon: HiClock,          label: post.duration });
  if (post?.date)           chips.push({ icon: HiOutlineCalendar, label: post.date });
  return chips.slice(0, 3);
};

/* ── component ── */
const PostItems = ({ post, onClick }) => {
  const [imageSrc, setImageSrc] = useState(post?.imageUrl || "/placeholder-post.svg");
  const [saved, setSaved] = useState(false);

  useEffect(() => { setImageSrc(post?.imageUrl || "/placeholder-post.svg"); }, [post?.imageUrl]);

  const handleKeyDown = (e) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }
  };

  const themeClass   = getCategoryThemeClass(post?.category);
  const emoji        = EMOJI[post?.subCategory] || "📌";
  const primaryLabel = getPrimaryLabel(post?.category);
  const chips        = getChips(post);
  const metaText     = getMetaText(post);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group flex flex-col h-full w-full bg-[var(--bg-card)] rounded-[20px] overflow-hidden border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(15,23,42,0.07)] hover:shadow-[0_10px_32px_rgba(15,23,42,0.13)] hover:-translate-y-1 transition-[transform,box-shadow] duration-200 cursor-pointer select-none ${themeClass}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* ── Image ── */}
      <div className="relative w-full overflow-hidden" style={{ height: "210px" }}>
        <img
          src={imageSrc}
          alt={post?.title || "post"}
          onError={() => setImageSrc("/placeholder-post.svg")}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--bg-card)]/20 to-transparent pointer-events-none" />

        {/* category pill — top left */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--bg-card)]/95 px-2.5 py-1 text-[11px] font-semibold text-[var(--text-heading)] shadow-sm backdrop-blur-sm">
          {emoji} {post?.subCategory || post?.category}
        </span>

        {/* save — top right */}
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); setSaved((v) => !v); }}
          aria-label={saved ? "Unsave" : "Save"}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-card)]/95 shadow-sm backdrop-blur-sm transition hover:bg-[var(--bg-card)]"
        >
          {saved
            ? <HiHeart className="text-[15px] text-[var(--brand)]" />
            : <HiOutlineHeart className="text-[15px] text-[var(--text-muted)]" />}
        </motion.button>

        {/* distance — bottom right */}
        {post?.distance && (
          <span className="absolute bottom-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-[var(--text-heading)]/45 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--bg-card)] backdrop-blur-sm">
            📍 {post.distance}
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">

        {/* title + rating */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="line-clamp-2 flex-1 text-[15px] font-bold leading-snug text-[var(--text-heading)]">
            {post?.title}
          </h2>
          <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
            <HiStar className="text-[13px] text-amber-400" />
            <span className="text-[12px] font-bold text-[var(--text-heading)]">4.8</span>
            <span className="text-[11px] text-[var(--text-faint)]">(24)</span>
          </div>
        </div>

        {/* location */}
        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[var(--text-muted)]">
          <HiLocationMarker className="shrink-0 text-[12px] text-[var(--brand)]" />
          <span className="truncate">{post?.location || "Location not set"}</span>
        </div>

        {/* user row */}
        <div className="mt-3 flex items-center gap-2">
          <div className="relative shrink-0">
            <Image
              src={post?.userImage || "/avatar-placeholder.svg"}
              width={26} height={26}
              alt={post?.userName || "User"}
              className="h-[26px] w-[26px] rounded-full border border-[var(--border-subtle)] object-cover"
            />
            {post?.isVerified && (
              <HiBadgeCheck className="absolute -bottom-0.5 -right-0.5 text-[10px] text-[var(--brand)] drop-shadow-[0_0_2px_var(--bg-card)]" />
            )}
          </div>
          <span className="truncate text-[11.5px] font-semibold text-[var(--text-body)]">{post?.userName}</span>
          <span className="ml-auto shrink-0 text-[10.5px] text-[var(--text-faint)]">{post?.postedTime}</span>
        </div>

        {/* divider */}
        <div className="my-2.5 h-px bg-[var(--border-subtle)]" />

        {/* chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {chips.map(({ icon: Icon, label }, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-input)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-body)]">
                <Icon className="text-[11px] text-[var(--text-faint)]" />
                {label}
              </span>
            ))}
          </div>
        )}

        {/* footer: meta left + CTA right */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div>
            {metaText ? (
              <>
                <p className="text-[18px] font-black leading-none text-[var(--text-heading)]">{metaText}</p>
                <p className="mt-0.5 text-[10.5px] text-[var(--text-faint)]">
                  {post?.category === "For Sale" ? "asking price" : "needed"}
                </p>
              </>
            ) : (
              <>
                <p className="text-[14px] font-bold leading-none text-[var(--text-heading)]">{post?.category}</p>
                <p className="mt-0.5 text-[10.5px] text-[var(--text-faint)]">post</p>
              </>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--brand)] px-4 py-2 text-[12.5px] font-bold text-white shadow-[0_4px_12px_rgba(255,122,0,0.35)] transition-[background-color,box-shadow] hover:bg-[var(--brand-hover)] hover:shadow-[0_6px_18px_rgba(255,122,0,0.45)]"
          >
            <HiOutlineUserAdd className="text-[13px]" />
            {primaryLabel}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostItems;
