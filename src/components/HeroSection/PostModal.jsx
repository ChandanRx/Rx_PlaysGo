"use client"
import React from 'react'
import { HiLocationMarker, HiOutlineCalendar, HiOutlineXCircle } from 'react-icons/hi'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

const PostModal = ({ post }) => {
  const { data: session } = useSession()

  return (
    <div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box max-w-lg border border-white/10 bg-black/60 p-0 text-slate-50 shadow-[0_18px_60px_rgba(0,0,0,0.8)] backdrop-blur">
          <div className="modal-action m-0 p-0 relative">
            <form method="dialog" className="w-full">
              {/* Close Button */}
              <button className="absolute right-3 top-3 text-slate-400 transition-colors hover:text-red-400">
                <HiOutlineXCircle className="text-[28px]" />
              </button>

              <div className="border-t border-white/10">
                {/* Image */}
                <img
                  className="h-[220px] w-full border-b border-white/10 object-cover"
                  src={post?.imageUrl}
                  alt="poster"
                />

                {/* Content with Tailwind animation */}
                <div className="p-4 transition-all duration-500 ease-out">
                  <h5 className="mb-3 text-xl font-semibold tracking-tight text-slate-50">
                    {post?.title}
                  </h5>

                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-300 md:text-sm">
                    <HiOutlineCalendar className="text-lg text-amber-300" />
                    {post?.date}
                  </div>

                  <div className="mb-3 flex items-center gap-2 text-xs text-slate-300 md:text-sm">
                    <HiLocationMarker className="text-lg text-emerald-300" />
                    {post?.location}
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-slate-300">
                    If you're interested, reach out to the organizer using the details below and join the match before
                    all spots are taken.
                  </p>

                  <div className="mb-4 border-t border-white/10" />

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Image
                      src={post?.userImage}
                      alt="user-image"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full border border-white/15 object-cover"
                    />
                    <div>
                      <h2 className="text-[14px] font-semibold text-slate-50">
                        {post?.userName}
                      </h2>
                      <h2 className="text-[13px] font-light text-slate-300">
                        {post?.email}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default PostModal
