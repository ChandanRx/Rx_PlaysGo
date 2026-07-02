"use client";

import React from "react";
import Image from "next/image";
import {
  HiBadgeCheck, HiLocationMarker, HiOutlineBookmark,
  HiOutlineCalendar, HiOutlineChatAlt2, HiOutlinePhone,
  HiOutlineShare, HiOutlineXCircle,
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import Button from "../ui/Button";

const getCategoryThemeClass = (c) => {
  if (c === "Players")    return "category-theme--players";
  if (c === "Local Help") return "category-theme--local-help";
  if (c === "For Sale")   return "category-theme--for-sale";
  return "";
};

const detailItems = (post) => [
  { label: "Category",           value: post?.category           || "Other" },
  { label: "Sub category",       value: post?.subCategory        || "General" },
  { label: "Distance",           value: post?.distance           || "Nearby" },
  { label: "Posted",             value: post?.postedTime         || "Recently" },
  { label: "Contact preference", value: post?.contactPreference  || "Chat Only" },
  { label: "Radius",             value: post?.radius             || "10 KM" },
];

const getDetailsSection = (post) => {
  if (post?.category === "For Sale") return { title: "Sale details", rows: [["Available from", post?.date || "Available now"], ["Pickup time", post?.time || "Flexible"], ["Condition", post?.duration || "Not specified"], ["Price", post?.requiredPeople || "Ask for price"]] };
  if (post?.category === "Local Help") return { title: "Help details", rows: [["Preferred date", post?.date || "Flexible"], ["Preferred time", post?.time || "Flexible"], ["Duration", post?.duration || "Not specified"], ["Helpers needed", post?.requiredPeople || "Not specified"]] };
  return { title: "Match details", rows: [["Date", post?.date || "Flexible"], ["Time", post?.time || "Flexible"], ["Duration", post?.duration || "Not specified"], ["Players needed", post?.requiredPeople || "Not specified"]] };
};

const PostModal = ({ post }) => {
  const themeClass     = getCategoryThemeClass(post?.category);
  const detailsSection = getDetailsSection(post);

  return (
    <dialog id="my_modal_1" className="modal">
      <div className={`modal-box w-full max-w-2xl overflow-hidden rounded-sm bg-[var(--bg-card)] shadow-[0_20px_60px_rgba(30,20,10,0.16)] ${themeClass}`}>

        {/* image + close */}
        <div className="relative">
          <form method="dialog" className="absolute right-3 top-3 z-10">
            <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-card)]/90 text-[var(--text-muted)] shadow-sm backdrop-blur-sm transition hover:bg-[var(--bg-card)] hover:text-[var(--text-heading)]">
              <HiOutlineXCircle className="text-[22px]" />
            </button>
          </form>
          <img
            className="h-[220px] w-full object-cover md:h-[280px]"
            src={post?.imageUrl || "/placeholder-post.svg"}
            alt={post?.title || "post"}
          />
        </div>

        <div className="space-y-5 p-5 md:p-6">

          {/* badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="category-accent-bg rounded-full px-3 py-1 text-[11px] font-semibold">{post?.category || "Other"}</span>
            <span className="category-soft-chip rounded-full px-3 py-1 text-[11px]">{post?.subCategory || "General"}</span>
            <span className="category-soft-chip rounded-full px-3 py-1 text-[11px]">{post?.distance || "Nearby"}</span>
          </div>

          {/* title + user */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-[22px] font-black leading-tight text-[var(--text-heading)] md:text-[26px]">{post?.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px] text-[var(--text-muted)]">
                {post?.location && (
                  <span className="flex items-center gap-1.5">
                    <HiLocationMarker className="category-accent-text text-[14px]" />
                    {post.location}
                  </span>
                )}
                {(post?.date || post?.time) && (
                  <span className="flex items-center gap-1.5">
                    <HiOutlineCalendar className="category-accent-text text-[14px]" />
                    {[post.date, post.time].filter(Boolean).join(" • ")}
                  </span>
                )}
              </div>
            </div>

            <div className="category-soft-panel flex shrink-0 items-center gap-3 rounded-sm px-3 py-2.5">
              <Image
                src={post?.userImage || "/avatar-placeholder.svg"}
                alt="user" width={40} height={40}
                className="h-10 w-10 rounded-full border category-accent-border object-cover"
              />
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-[13px] font-bold text-[var(--text-heading)]">{post?.userName}</p>
                  {post?.isVerified && <HiBadgeCheck className="category-accent-text text-[13px]" />}
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">{post?.email}</p>
              </div>
            </div>
          </div>

          {/* description */}
          <p className="text-[13.5px] leading-relaxed text-[var(--text-body)]">{post?.desc}</p>

          {/* detail chips */}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {detailItems(post).map((item) => (
              <div key={item.label} className="category-soft-panel rounded-sm px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{item.label}</p>
                <p className="mt-1 text-[13px] font-bold text-[var(--text-heading)]">{item.value}</p>
              </div>
            ))}
          </div>

          {/* contact + match details */}
          <div className="grid gap-3 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
            <div className="category-soft-panel rounded-sm p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">Contact</p>
              <div className="space-y-1.5 text-[12.5px] text-[var(--text-body)]">
                <p>Email: {post?.email}</p>
                <p>Phone: {post?.phone || "Not shared"}</p>
                <p>WhatsApp: {post?.whatsapp || "Not shared"}</p>
              </div>
            </div>
            <div className="category-soft-panel rounded-sm p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">{detailsSection.title}</p>
              <div className="space-y-1.5 text-[12.5px] text-[var(--text-body)]">
                {detailsSection.rows.map(([label, value]) => (
                  <p key={label}>{label}: {value}</p>
                ))}
              </div>
            </div>
          </div>

          {/* action buttons */}
          <div className="flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-4">
            <Button variant="yellow" size="sm">
              <HiOutlineChatAlt2 className="text-[14px]" /> Chat
            </Button>
            <Button variant="secondary" size="sm">
              <FaWhatsapp className="text-[14px]" /> WhatsApp
            </Button>
            <Button variant="secondary" size="sm">
              <HiOutlinePhone className="text-[14px]" /> Call
            </Button>
            <Button variant="ghost" size="sm">
              <HiOutlineBookmark className="text-[14px]" /> Save
            </Button>
            <Button variant="ghost" size="sm">
              <HiOutlineShare className="text-[14px]" /> Share
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default PostModal;
