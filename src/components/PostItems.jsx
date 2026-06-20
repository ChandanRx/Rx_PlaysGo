'use client'
import Image from 'next/image'
import React from 'react'
import { HiLocationMarker, HiOutlineCalendar } from 'react-icons/hi'
import { motion } from 'framer-motion'
import Card from './ui/Card'

const MotionCard = motion(Card);

const PostItems = ({ post }) => {
    return (
        <MotionCard
            variant="item"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-sm cursor-pointer hover:-translate-y-1"
        >
            <img
                className="h-[180px] w-full border-b border-[#89f336]/20 object-cover"
                src={post?.imageUrl || '/about.jpg'}
                alt="poster"
            />

            <div className="p-4 text-zinc-950 md:p-5">
                <h5 className="mb-2 text-lg font-semibold tracking-tight text-zinc-950 md:text-xl">
                    {post?.title}
                </h5>

                <div className="mb-2 flex items-center gap-2 text-xs text-zinc-700 md:text-sm">
                    <HiOutlineCalendar className="text-base text-yellow-500" />
                    <span>{post?.date}</span>
                </div>

                <div className="mb-3 flex items-center gap-2 text-xs text-zinc-700 md:text-sm">
                    <HiLocationMarker className="text-base text-[#89f336]" />
                    <span>{post?.location}</span>
                </div>

                <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-zinc-700 md:text-sm">
                    {post?.desc}
                </p>

                <div className="flex items-center gap-3 border-t border-[#89f336]/20 pt-3">
                    <Image
                        src={post?.userImage}
                        alt="user-image"
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full border border-[#89f336]/30 object-cover"
                    />
                    <div>
                        <p className="text-xs font-medium text-zinc-800 md:text-sm">
                            {post?.userName}
                        </p>
                        <p className="text-[11px] text-zinc-500">Post owner</p>
                    </div>
                </div>
            </div>
        </MotionCard>
    )
}

export default PostItems
