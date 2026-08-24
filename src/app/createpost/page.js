"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { m } from "framer-motion";
import { createPost, getPosts, updatePost } from "../../shared/dummyPosts";
import Data from "../../shared/data";
import { Input, Textarea } from "../../components/ui/FormControls";
import Dropdown from "../../components/ui/Dropdown";
import DatePicker from "../../components/ui/DatePicker";
import TimePicker from "../../components/ui/TimePicker";
import { ArrowUpTrayIcon, CheckIcon, PencilSquareIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { staggerContainer, staggerItem } from "../../shared/motionPresets";
import { useMountReveal } from "../../hooks/useMountReveal";

// Leaflet touches window on import, so the map picker is client-only.
const LocationPicker = dynamic(() => import("../../components/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)]" />
  ),
});

const labelClass = "mb-1.5 block text-[13px] font-semibold text-[var(--text-body)]";

const games = Data.subCategoryMap.Players;

const CreatePost = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") || "";
  const isEditing = Boolean(editId);

  const reveal = useMountReveal();
  const fileInputRef = useRef(null);
  const [input, setInput] = useState({
    game: "",
    title: "",
    desc: "",
    location: "",
    coords: null,
    eventDate: "",
    time: "",
    imageUrl: "",
  });

  // Pre-fill form when editing an existing post
  useEffect(() => {
    if (!editId) return;
    const all = getPosts();
    const found = all.find((p) => String(p.id) === String(editId));
    if (!found) return;
    setInput({
      game:      found.subCategory || "",
      title:     found.title       || "",
      desc:      found.desc        || "",
      location:  found.location    || "",
      coords:    found.coords      || null,
      eventDate: found.date        || "",
      time:      found.time        || "",
      imageUrl:  found.imageUrl    || "",
    });
  }, [editId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setInput((p) => ({ ...p, [name]: value }));
  };

  const setField = (name) => (value) => setInput((p) => ({ ...p, [name]: value }));

  // Map pin → coords always; the address label arrives a moment later (best-
  // effort reverse geocode) and fills the location field when present.
  const handlePick = (coords, label) =>
    setInput((p) => ({ ...p, coords, ...(label ? { location: label } : {}) }));

  // Optional upload — read the file as a data URL so it previews and persists
  // without a backend. Leaving this empty makes createPost pick a default
  // sports image automatically.
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInput((p) => ({ ...p, imageUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setInput((p) => ({ ...p, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updatePost(editId, {
        subCategory: input.game,
        title:       input.title,
        desc:        input.desc,
        location:    input.location,
        coords:      input.coords,
        date:        input.eventDate,
        time:        input.time,
        imageUrl:    input.imageUrl,
      });
      alert("Post updated!");
    } else {
      createPost({ ...input, category: "Players" });
      alert("Post created!");
    }
    router.push("/profile");
  };

  return (
    <div className="rounded-2xl bg-[var(--bg-card)]">
      {/* header */}
      <div className="px-1 pb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] category-accent-text">
          {isEditing ? "Edit post" : "Create post"}
        </p>
        <h1 className="mt-1 text-[20px] font-black text-[var(--text-heading)]">
          {isEditing ? "Update your post" : "Find players nearby"}
        </h1>
        <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
          {isEditing
            ? "Make your changes and save them below."
            : "Fill in the details and publish your game request."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="px-1">
        <m.div
          className="grid gap-4 md:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          animate={reveal}
        >
          {/* Game */}
          <m.div variants={staggerItem} className="md:col-span-2">
            <label className={labelClass}>Game <span className="text-[var(--brand)]">*</span></label>
            <Dropdown
              variant="field"
              placeholder="Select a game"
              options={games}
              value={input.game}
              onChange={setField("game")}
            />
          </m.div>

          {/* Title */}
          <m.div variants={staggerItem} className="md:col-span-2">
            <label className={labelClass}>Title <span className="text-[var(--brand)]">*</span></label>
            <Input name="title" value={input.title} placeholder="Need 4 players for Sunday match" onChange={onChange} required />
          </m.div>

          {/* Description */}
          <m.div variants={staggerItem} className="md:col-span-2">
            <label className={labelClass}>Description <span className="text-[var(--brand)]">*</span></label>
            <Textarea name="desc" value={input.desc} placeholder="Add timing, expectations, location notes…" onChange={onChange} required />
          </m.div>

          {/* Location */}
          <m.div variants={staggerItem} className="md:col-span-2">
            <label className={labelClass}>Location <span className="text-[var(--brand)]">*</span></label>
            <Input name="location" value={input.location} placeholder="Sardar Patel Stadium, Navrangpura, Ahmedabad" onChange={onChange} required />
            <div className="mt-2">
              <LocationPicker value={input.coords} onPick={handlePick} />
            </div>
          </m.div>

          {/* Date */}
          <m.div variants={staggerItem}>
            <label className={labelClass}>Date <span className="text-[var(--brand)]">*</span></label>
            <DatePicker name="eventDate" value={input.eventDate} onChange={onChange} />
          </m.div>

          {/* Time */}
          <m.div variants={staggerItem}>
            <label className={labelClass}>Time <span className="text-[var(--brand)]">*</span></label>
            <TimePicker name="time" value={input.time} onChange={onChange} />
          </m.div>

          {/* Image (optional) */}
          <m.div variants={staggerItem} className="md:col-span-2">
            <label className={labelClass}>Image <span className="text-[var(--text-faint)]">(optional)</span></label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />

            {input.imageUrl ? (
              <div className="relative mt-1 overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={input.imageUrl} alt="Post preview" className="max-h-56 w-full object-cover" />
                <button
                  type="button"
                  onClick={clearImage}
                  aria-label="Remove image"
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-card)]/90 shadow-sm backdrop-blur-sm transition hover:bg-[var(--bg-card)]"
                >
                  <XMarkIcon className="h-4 w-4 text-[var(--text-heading)]" strokeWidth={2.25} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-input)] px-4 py-8 text-center transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                  <ArrowUpTrayIcon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="text-[13px] font-semibold text-[var(--text-body)]">Upload an image</span>
                <span className="flex items-center gap-1 text-[11.5px] text-[var(--text-muted)]">
                  <PhotoIcon className="h-3.5 w-3.5" />
                  Optional — we&apos;ll use a default sports image if you skip this
                </span>
              </button>
            )}
          </m.div>
        </m.div>

        {/* actions */}
        <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-4 sm:flex-row sm:justify-between">
          <button type="button" onClick={() => router.push("/")} className="text-[13px] font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-heading)]">Cancel</button>
          <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--brand)] px-6 py-2 text-[13px] font-bold text-[var(--on-brand)] shadow-[0_4px_12px_rgba(var(--brand-rgb),0.28)] transition hover:bg-[var(--brand-hover)]">
            {isEditing
              ? <><PencilSquareIcon className="h-4 w-4" strokeWidth={2.5} /> Save Changes</>
              : <><CheckIcon className="h-4 w-4" strokeWidth={2.5} /> Publish</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
