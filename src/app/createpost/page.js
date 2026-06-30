"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "../../shared/dummyPosts";
import Data from "../../shared/data";
import { getCategoryLabel, getStoredAppCategory } from "../../shared/appPreferences";
import { Input, Select, Textarea } from "../../components/ui/FormControls";

const label = "mb-1.5 block text-[13px] font-semibold text-[#374151]";
const hint  = "mt-1 text-[12px] text-[#6B7280]";

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

  const onSubmit = (e) => {
    e.preventDefault();
    createPost(input);
    alert("Post created!");
    router.push("/profile");
  };

  /* ── no mode chosen ── */
  if (!stored) return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#E8EDF5] bg-white p-12 text-center shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
      <div className="mb-3 text-5xl">⚙️</div>
      <h2 className="text-[18px] font-black text-[#0F1623]">Choose a mode first</h2>
      <p className="mt-2 text-[13px] text-[#6B7280]">Go to Settings and pick Sports, Helper, or Sale before creating a post.</p>
      <button type="button" onClick={() => router.push("/settings")} className="mt-5 rounded-full bg-[#FF7A00] px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(255,122,0,0.3)] transition hover:bg-[#F26A00]">
        Open Settings
      </button>
    </div>
  );

  /* ── step content ── */
  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2 rounded-[12px] border border-[#E8EDF5] bg-[#F8FAFC] px-4 py-3 text-[13px] text-[#374151]">
            Posting in <strong className="text-[#0F1623]">{getCategoryLabel(input.category)}</strong> mode. Change in Settings.
          </div>
          <div className="md:col-span-2"><label className={label}>Title</label><Input name="title" value={input.title||""} placeholder="Need 4 players for Sunday match" onChange={onChange} required /></div>
          <div><label className={label}>Subcategory</label><Select name="subCategory" value={input.subCategory||""} onChange={onChange}><option value="">Select subcategory</option>{subOpts.map((s) => <option key={s} value={s}>{s}</option>)}</Select></div>
          <div className="md:col-span-2"><label className={label}>Description</label><Textarea name="desc" value={input.desc||""} placeholder="Add timing, expectations, location notes…" onChange={onChange} required /></div>
          <div><label className={label}>{copy.dateLabel}</label><Input type="date" name="eventDate" value={input.eventDate||""} onChange={onChange} /></div>
          <div><label className={label}>{copy.timeLabel}</label><Input type="time" name="time" value={input.time||""} onChange={onChange} /></div>
          <div><label className={label}>{copy.durationLabel}</label><Input name="duration" value={input.duration||""} placeholder={input.category==="For Sale"?"Excellent":"2 hours"} onChange={onChange} /></div>
          <div><label className={label}>{copy.neededLabel}</label><Input type={copy.neededType} name="requiredPeople" value={input.requiredPeople||""} placeholder={copy.neededPlaceholder} onChange={onChange} /></div>
        </div>
      );
      case 1: return (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2 rounded-[12px] border border-[#E8EDF5] bg-[#F8FAFC] px-4 py-3 text-[13px] text-[#374151]">Location for your {getCategoryLabel(input.category).toLowerCase()} post</div>
          <div><label className={label}>Current location</label><Input name="currentLocation" value={input.currentLocation||""} placeholder="Use current location" onChange={onChange} /></div>
          <div><label className={label}>Search location</label><Input name="searchLocation" value={input.searchLocation||""} placeholder="SG Highway, Ahmedabad" onChange={onChange} /></div>
          <div><label className={label}>Radius</label><Select name="radius" value={input.radius} onChange={onChange}>{Data.radiusOptions.map((r) => <option key={r} value={r}>{r}</option>)}</Select></div>
          <div className="rounded-[12px] border border-dashed border-[#E8EDF5] bg-[#F8FAFC] p-4 text-[13px] text-[#6B7280]">Map preview placeholder</div>
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
          <div><label className={label}>Contact preference</label><Select name="contactPreference" value={input.contactPreference} onChange={onChange}>{Data.contactPreferences.map((c) => <option key={c} value={c}>{c}</option>)}</Select></div>
        </div>
      );
      default: return (
        <div className="grid gap-3 md:grid-cols-2">
          {[["Category",input.category],["Subcategory",input.subCategory||"Not selected"],["Title",input.title||"Untitled"],["Location",input.searchLocation||input.currentLocation||"Not added"],["Radius",input.radius],["Contact",input.contactPreference]].map(([l,v]) => (
            <div key={l} className="rounded-[12px] border border-[#E8EDF5] bg-[#F8FAFC] p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">{l}</p>
              <p className="mt-1 text-[13px] font-semibold text-[#0F1623]">{v}</p>
            </div>
          ))}
          <div className="rounded-[12px] border border-[#E8EDF5] bg-[#F8FAFC] p-3 md:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Description</p>
            <p className="mt-1 text-[13px] text-[#374151]">{input.desc||"No description added."}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={theme}>
      <div className="overflow-hidden rounded-[20px] border border-[#E8EDF5] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.07)]">

        {/* header */}
        <div className="border-b border-[#E8EDF5] px-5 py-5 md:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] category-accent-text">Create post</p>
          <h1 className="mt-1 text-[20px] font-black text-[#0F1623]">{copy.title}</h1>
          <p className="mt-0.5 text-[13px] text-[#6B7280]">{copy.desc}</p>
        </div>

        {/* step tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-[#E8EDF5] px-5 py-3 scrollbar-none">
          {steps.map((s, i) => (
            <button key={s} type="button" onClick={() => setStep(i)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all ${
                step === i ? "bg-[#0F1623] text-white"
                : i < step  ? "bg-[#FF7A00] text-white"
                : "border border-[#E8EDF5] text-[#6B7280] hover:border-[#0F1623]"
              }`}
            >{i+1}. {s}</button>
          ))}
        </div>

        {/* step body */}
        <form onSubmit={onSubmit} className="p-5 md:p-6">
          <div className="category-soft-panel rounded-[16px] p-4 md:p-5">{renderStep()}</div>

          <div className="mt-5 flex flex-col gap-3 border-t border-[#E8EDF5] pt-5 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => router.push("/")} className="rounded-full border border-[#E8EDF5] px-5 py-2 text-[13px] font-semibold text-[#6B7280] transition hover:border-[#0F1623] hover:text-[#0F1623]">Cancel</button>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep((s) => Math.max(0,s-1))} disabled={step===0} className="rounded-full border border-[#E8EDF5] px-5 py-2 text-[13px] font-semibold text-[#374151] transition hover:border-[#0F1623] disabled:opacity-40">← Back</button>
              {step < steps.length - 1
                ? <button type="button" onClick={() => setStep((s) => Math.min(steps.length-1,s+1))} className="rounded-full bg-[#0F1623] px-6 py-2 text-[13px] font-bold text-white transition hover:bg-[#1e293b]">Next →</button>
                : <button type="submit" className="rounded-full bg-[#FF7A00] px-6 py-2 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(255,122,0,0.3)] transition hover:bg-[#F26A00]">✓ Publish</button>
              }
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
