"use client"
import React from 'react'
import { HiLocationMarker, HiOutlineCalendar, HiOutlineXCircle } from 'react-icons/hi'
import Image from 'next/image'
import Card from '../ui/Card'
import Button from '../ui/Button'

const PostModal = ({ post }) => {
  return (
    <div>
      <dialog id="my_modal_1" className="modal">
        <Card as="div" variant="modal" className="modal-box max-w-lg p-0">
          <div className="modal-action m-0 p-0 relative">
            <form method="dialog" className="w-full">
              {/* Close Button */}
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-950"
              >
                <HiOutlineXCircle className="text-[28px]" />
              </Button>

              <div className="border-t border-[#89f336]/20">
                {/* Image */}
                <img
                  className="h-[220px] w-full border-b border-[#89f336]/20 object-cover"
                  src={post?.imageUrl || '/about.jpg'}
                  alt="poster"
                />

                {/* Content with Tailwind animation */}
                <div className="p-4 transition-all duration-500 ease-out">
                  <h5 className="mb-3 text-xl font-semibold tracking-tight text-zinc-950">
                    {post?.title}
                  </h5>

                  <div className="mb-2 flex items-center gap-2 text-xs text-zinc-700 md:text-sm">
                    <HiOutlineCalendar className="text-lg text-yellow-500" />
                    {post?.date}
                  </div>

                  <div className="mb-3 flex items-center gap-2 text-xs text-zinc-700 md:text-sm">
                    <HiLocationMarker className="text-lg text-[#89f336]" />
                    {post?.location}
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-zinc-700">
                    If you're interested, reach out to the organizer using the details below and join the match before
                    all spots are taken.
                  </p>

                  <div className="mb-4 border-t border-[#89f336]/20" />

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Image
                      src={post?.userImage}
                      alt="user-image"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full border border-[#89f336]/30 object-cover"
                    />
                    <div>
                      <h2 className="text-[14px] font-semibold text-zinc-950">
                        {post?.userName}
                      </h2>
                      <h2 className="text-[13px] font-light text-zinc-600">
                        {post?.email}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Card>
      </dialog>
    </div>
  )
}

export default PostModal
