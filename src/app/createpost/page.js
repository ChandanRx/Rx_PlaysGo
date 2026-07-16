"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "../../shared/dummyPosts";
import Data from "../../shared/data";
import { formatActiveCategoryList, getCategoryLabel, getStoredAppCategory } from "../../shared/appPreferences";
import { Input, Textarea } from "../../components/ui/FormControls";
import Dropdown from "../../components/ui/Dropdown";
import DatePicker from "../../components/ui/DatePicker";
import TimePicker from "../../components/ui/TimePicker";
import {
  ArrowRightIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const label = "mb-1.5 block text-[13px] font-semibold text-[var(--text-body)]";
const hint  = "mt-1 text-[12px] text-[var(--text-muted)]";

const steps = ["Details", "Location", "Media", "Contact", "Preview"];

const categoryCopy = {
  Players:      { title: "Find players nearby",          desc: "Create a match, practice, or local sport request.",                     dateLabel: "Date",           timeLabel: "Time",           durationLabel: "Duration",          neededLabel: "Players needed", neededType: "number", neededPlaceholder: "4" },
  "Local Help": { title: "Request local help",           desc: "Post for tutors, moving help, drivers, volunteers, or freelancers.",    dateLabel: "Preferred date", timeLabel: "Preferred time", durationLabel: "Est. duration",     neededLabel: "Helpers needed", neededType: "number", neededPlaceholder: "2" },
  "For Sale":   { title: "List something for sale",      desc: "Sell an item nearby with clear price and pickup details.",              dateLabel: "Available from", timeLabel: "Pickup time",    durationLabel: "Condition",         neededLabel: "Price",          neededType: "text",   neededPlaceholder: "₹ 5000" },
};

const getCategoryTheme = (c) => c === "Players" ? "category-theme--players" : c === "Local Help" ? "category-theme--local-help" : c === "For Sale" ? "category-theme--for-sale" : "";

const CreatePost = () => {
  const router = useRouter();
  const [step, setStep]   = useState(0);
  const [stored, setStored] = useState("");
  const [input, setInput] = useState({ category: "Players", contactPreference: "WhatsApp", radius: "10 KM" });

  useEffect(() => {
    const cat = getStoredAppCategory();
    setStored(cat);
    if (cat) setInput((p) => ({ ...p, category: cat }));
  }, []);

  const copy    = categoryCopy[input.category] || categoryCopy.Players;
  const theme   = getCategoryTheme(input.category);
  const subOpts = useMemo(() => Data.subCategoryMap[input.category] || Data.subCategoryMap.Other, [input.category]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInput((p) => ({ ...p, [name]: type === "checkbox" ? checked : value, ...(name === "category" ? { subCategory: "", duration: "", requiredPeople: "" } : {}) }));
  };

  const setField = (name) => (fieldValue) => setInput((p) => ({ ...p, [name]: fieldValue }));

  const onSubmit = (e) => {
    e.preventDefault();
    createPost(input);
    alert("Post created!");
    router.push("/profile");
  };

  /* ── no mode chosen ── */
  if (!stored) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-12 text-center shadow-[0_2px_12px_rgba(28,32,18,0.06)]">
      <Cog6ToothIcon className="mb-3 h-12 w-12 text-[var(--brand)]" strokeWidth={1.75} />
      <h2 className="text-[18px] font-black text-[var(--text-heading)]">Choose a mode first</h2>
      <p className="mt-2 text-[13px] text-[var(--text-muted)]">Go to Settings and pick {formatActiveCategoryList()} before creating a post.</p>
      <button type="button" onClick={() => router.push("/settings")} className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--brand)] px-6 py-2.5 text-[13px] font-bold text-[var(--on-brand)] shadow-[0_4px_12px_rgba(var(--brand-rgb),0.28)] transition hover:bg-[var(--brand-hover)]">
        Open Settings
        <ArrowRightIcon className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </div>
  );

  /* ── step content ── */
  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div className="grid gap-4 md:grid-cols-2">
          <p className="md:col-span-2 text-[12.5px] text-[var(--text-muted)]">
            Posting in <strong className="font-semibold text-[var(--text-heading)]">{getCategoryLabel(input.category)}</strong> mode — change this in Settings.
          </p>
          <div className="md:col-span-2"><label className={label}>Title</label><Input name="title" value={input.title||""} placeholder="Need 4 players for Sunday match" onChange={onChange} required /></div>
          <div><label className={label}>Subcategory</label><Dropdown variant="field" placeholder="Select subcategory" options={subOpts} value={input.subCategory||""} onChange={setField("subCategory")} /></div>
          <div className="md:col-span-2"><label className={label}>Description</label><Textarea name="desc" value={input.desc||""} placeholder="Add timing, expectations, location notes…" onChange={onChange} required /></div>
          <div><label className={label}>{copy.dateLabel}</label><DatePicker name="eventDate" value={input.eventDate||""} onChange={onChange} /></div>
          <div><label className={label}>{copy.timeLabel}</label><TimePicker name="time" value={input.time||""} onChange={onChange} /></div>
          <div><label className={label}>{copy.durationLabel}</label><Input name="duration" value={input.duration||""} placeholder={input.category==="For Sale"?"Excellent":"2 hours"} onChange={onChange} /></div>
          <div><label className={label}>{copy.neededLabel}</label><Input type={copy.neededType} name="requiredPeople" value={input.requiredPeople||""} placeholder={copy.neededPlaceholder} onChange={onChange} /></div>
        </div>
      );
      case 1: return (
        <div className="grid gap-4 md:grid-cols-2">
          <p className="md:col-span-2 text-[12.5px] text-[var(--text-muted)]">Location for your {getCategoryLabel(input.category).toLowerCase()} post</p>
          <div><label className={label}>Current location</label><Input name="currentLocation" value={input.currentLocation||""} placeholder="Use current location" onChange={onChange} /></div>
          <div><label className={label}>Search location</label><Input name="searchLocation" value={input.searchLocation||""} placeholder="SG Highway, Ahmedabad" onChange={onChange} /></div>
          <div><label className={label}>Radius</label><Dropdown variant="field" options={Data.radiusOptions} value={input.radius} onChange={setField("radius")} /></div>
          <div className="flex items-center justify-center rounded-xl bg-[var(--bg-secondary)] p-4 text-[12.5px] text-[var(--text-faint)]">Map preview placeholder</div>
        </div>
      );
      case 2: return (
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className={label}>Image URL</label><Input name="imageUrl" value={input.imageUrl||""} placeholder="https://example.com/image.jpg" onChange={onChange} /></div>
          <div><label className={label}>Video URL</label><Input name="videoUrl" value={input.videoUrl||""} placeholder="https://example.com/video.mp4" onChange={onChange} /></div>
        </div>
      );
      case 3: return (
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className={label}>Phone</label><Input name="phone" value={input.phone||""} onChange={onChange} /></div>
          <div><label className={label}>WhatsApp</label><Input name="whatsapp" value={input.whatsapp||""} onChange={onChange} /></div>
          <div><label className={label}>Email</label><Input type="email" name="email" value={input.email||""} onChange={onChange} /></div>
          <div><label className={label}>Contact preference</label><Dropdown variant="field" options={Data.contactPreferences} value={input.contactPreference} onChange={setField("contactPreference")} /></div>
        </div>
      );
      default: return (
        <div className="divide-y divide-[var(--border-subtle)]">
          {[["Category",input.category],["Subcategory",input.subCategory||"Not selected"],["Title",input.title||"Untitled"],["Location",input.searchLocation||input.currentLocation||"Not added"],["Radius",input.radius],["Contact",input.contactPreference]].map(([l,v]) => (
            <div key={l} className="flex items-center justify-between gap-4 py-2.5 text-[13px]">
              <p className="text-[var(--text-muted)]">{l}</p>
              <p className="truncate font-semibold text-[var(--text-heading)]">{v}</p>
            </div>
          ))}
          <div className="py-2.5">
            <p className="text-[13px] text-[var(--text-muted)]">Description</p>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-body)]">{input.desc||"No description added."}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={theme}>
      <div className="rounded-2xl bg-[var(--bg-card)]">

        {/* header */}
        <div className="px-1 pb-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] category-accent-text">Create post</p>
          <h1 className="mt-1 text-[20px] font-black text-[var(--text-heading)]">{copy.title}</h1>
          <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">{copy.desc}</p>
        </div>

        {/* step tabs */}
        <div className="flex gap-1.5 overflow-x-auto px-1 pb-4 scrollbar-none">
          {steps.map((s, i) => (
            <button key={s} type="button" onClick={() => setStep(i)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all ${
                step === i ? "bg-[var(--brand)] text-[var(--on-brand)]"
                : i < step  ? "text-[var(--text-heading)]"
                : "text-[var(--text-faint)]"
              }`}
            >{s}</button>
          ))}
        </div>

        {/* step body */}
        <form onSubmit={onSubmit} className="px-1">
          {renderStep()}

          <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-4 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => router.push("/")} className="text-[13px] font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-heading)]">Cancel</button>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep((s) => Math.max(0,s-1))} disabled={step===0} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--bg-secondary)] px-5 py-2 text-[13px] font-semibold text-[var(--text-body)] transition disabled:opacity-40">
                <ChevronLeftIcon className="h-4 w-4" strokeWidth={2.25} />
                Back
              </button>
              {step < steps.length - 1
                ? <button type="button" onClick={() => setStep((s) => Math.min(steps.length-1,s+1))} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--text-heading)] px-6 py-2 text-[13px] font-bold text-[var(--selected-fg)] transition hover:bg-[var(--text-heading)]/85">
                    Next
                    <ChevronRightIcon className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                : <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--brand)] px-6 py-2 text-[13px] font-bold text-[var(--on-brand)] shadow-[0_4px_12px_rgba(var(--brand-rgb),0.28)] transition hover:bg-[var(--brand-hover)]">
                    <CheckIcon className="h-4 w-4" strokeWidth={2.5} />
                    Publish
                  </button>
              }
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
