"use client";

import { useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon, HeartIcon, ShareIcon, XMarkIcon } from "@heroicons/react/24/outline";

const StoryViewer = ({ stories, index, onClose, onPrevious, onNext }) => {
  const story = stories[index];
  useEffect(() => {
    const timer = setTimeout(onNext, 5000);
    return () => clearTimeout(timer);
  }, [index, onNext]);
  if (!story) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-0 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label="Story viewer">
      <div className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-[#1B1B18] sm:h-[min(760px,calc(100vh-3rem))] sm:rounded-[28px]" style={{ background: story.background }}>
        <div className="absolute inset-x-4 top-4 z-10 flex gap-1">{stories.map((item, itemIndex) => <span key={item.id} className={`h-1 flex-1 overflow-hidden rounded-full bg-white/35`}><i className={`block h-full bg-white ${itemIndex < index ? "w-full" : itemIndex === index ? "animate-[story-progress_5s_linear_forwards]" : "w-0"}`} /></span>)}</div>
        <div className="absolute inset-x-5 top-9 z-10 flex items-center justify-between text-white"><div><p className="font-bold">{story.username}</p><p className="text-xs text-white/70">{story.sport} · {story.timeAgo}</p></div><button type="button" onClick={onClose} aria-label="Close story"><XMarkIcon className="h-7 w-7" /></button></div>
        <div className="flex flex-1 items-end bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,.24),transparent_36%)] p-7 pb-24"><div><span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">{story.sport}</span><h2 className="mt-3 text-3xl font-black leading-tight text-white">{story.caption}</h2><p className="mt-2 text-sm text-white/80">Shared with the PlaysGo community</p></div></div>
        <div className="absolute inset-x-5 bottom-5 z-10 flex items-center gap-3"><button type="button" className="flex-1 rounded-full border border-white/40 px-4 py-3 text-left text-sm text-white/80">Send a reaction…</button><button type="button" aria-label="Like story"><HeartIcon className="h-6 w-6 text-white" /></button><button type="button" aria-label="Share story"><ShareIcon className="h-6 w-6 text-white" /></button></div>
        <button type="button" onClick={onPrevious} aria-label="Previous story" className="absolute inset-y-0 left-0 z-[1] w-1/4"><ArrowLeftIcon className="ml-3 h-7 w-7 text-white/0 transition hover:text-white/80" /></button>
        <button type="button" onClick={onNext} aria-label="Next story" className="absolute inset-y-0 right-0 z-[1] flex w-1/4 items-center justify-end"><ArrowRightIcon className="mr-3 h-7 w-7 text-white/0 transition hover:text-white/80" /></button>
      </div>
    </div>
  );
};
export default StoryViewer;
