"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "../../shared/dummyPosts";
import Data from "../../shared/data";
import { Input, Textarea } from "../../components/ui/FormControls";
import Dropdown from "../../components/ui/Dropdown";
import DatePicker from "../../components/ui/DatePicker";
import TimePicker from "../../components/ui/TimePicker";
import { CheckIcon } from "@heroicons/react/24/outline";

const labelClass = "mb-1.5 block text-[13px] font-semibold text-[var(--text-body)]";

const games = Data.subCategoryMap.Players;

const CreatePost = () => {
  const router = useRouter();
  const [input, setInput] = useState({
    game: "",
    title: "",
    desc: "",
    location: "",
    eventDate: "",
    time: "",
    imageUrl: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setInput((p) => ({ ...p, [name]: value }));
  };

  const setField = (name) => (value) => setInput((p) => ({ ...p, [name]: value }));

  const onSubmit = (e) => {
    e.preventDefault();
    createPost({ ...input, category: "Players" });
    alert("Post created!");
    router.push("/profile");
  };

  return (
    <div className="rounded-2xl bg-[var(--bg-card)]">
      {/* header */}
      <div className="px-1 pb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] category-accent-text">Create post</p>
        <h1 className="mt-1 text-[20px] font-black text-[var(--text-heading)]">Find players nearby</h1>
        <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">Fill in the details and publish your game request.</p>
      </div>

      <form onSubmit={onSubmit} className="px-1">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Game */}
          <div className="md:col-span-2">
            <label className={labelClass}>Game <span className="text-[var(--brand)]">*</span></label>
            <Dropdown
              variant="field"
              placeholder="Select a game"
              options={games}
              value={input.game}
              onChange={setField("game")}
            />
          </div>

          {/* Title */}
          <div className="md:col-span-2">
            <label className={labelClass}>Title <span className="text-[var(--brand)]">*</span></label>
            <Input name="title" value={input.title} placeholder="Need 4 players for Sunday match" onChange={onChange} required />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className={labelClass}>Description <span className="text-[var(--brand)]">*</span></label>
            <Textarea name="desc" value={input.desc} placeholder="Add timing, expectations, location notes…" onChange={onChange} required />
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className={labelClass}>Location <span className="text-[var(--brand)]">*</span></label>
            <Input name="location" value={input.location} placeholder="Shivaji Park, Mumbai" onChange={onChange} required />
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>Date <span className="text-[var(--brand)]">*</span></label>
            <DatePicker name="eventDate" value={input.eventDate} onChange={onChange} />
          </div>

          {/* Time */}
          <div>
            <label className={labelClass}>Time <span className="text-[var(--brand)]">*</span></label>
            <TimePicker name="time" value={input.time} onChange={onChange} />
          </div>

          {/* Image (optional) */}
          <div className="md:col-span-2">
            <label className={labelClass}>Image <span className="text-[var(--text-faint)]">(optional)</span></label>
            <Input name="imageUrl" value={input.imageUrl} placeholder="Paste an image URL" onChange={onChange} />
            {input.imageUrl.trim() && (
              <div className="mt-2 overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={input.imageUrl} alt="Post preview" className="max-h-56 w-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-4 sm:flex-row sm:justify-between">
          <button type="button" onClick={() => router.push("/")} className="text-[13px] font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-heading)]">Cancel</button>
          <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--brand)] px-6 py-2 text-[13px] font-bold text-[var(--on-brand)] shadow-[0_4px_12px_rgba(var(--brand-rgb),0.28)] transition hover:bg-[var(--brand-hover)]">
            <CheckIcon className="h-4 w-4" strokeWidth={2.5} />
            Publish
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
