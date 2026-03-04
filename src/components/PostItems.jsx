'use client'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'
import { HiLocationMarker, HiOutlineCalendar } from 'react-icons/hi'
import { motion } from 'framer-motion'

const PostItems = ({ post }) => {
    const { data: session } = useSession()

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-sm cursor-pointer overflow-hidden rounded-md border 
            border-gray-900 bg-black/40 shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur 
            transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/70"
        >
            <img
                className="h-[180px] w-full border-b border-white/5 object-cover"
                src={post?.imageUrl}
                alt="poster"
            />

            <div className="p-4 text-slate-50 md:p-5">
                <h5 className="mb-2 text-lg font-semibold tracking-tight text-slate-50 md:text-xl">
                    {post?.title}
                </h5>

                <div className="mb-2 flex items-center gap-2 text-xs text-slate-300 md:text-sm">
                    <HiOutlineCalendar className="text-base text-amber-300" />
                    <span>{post?.date}</span>
                </div>

                <div className="mb-3 flex items-center gap-2 text-xs text-slate-300 md:text-sm">
                    <HiLocationMarker className="text-base text-emerald-300" />
                    <span>{post?.location}</span>
                </div>

                <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                    {post?.desc}
                </p>

                <div className="flex items-center gap-3 border-t border-white/5 pt-3">
                    <Image
                        src={post?.userImage}
                        alt="user-image"
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full border border-white/15 object-cover"
                    />
                    <div>
                        <p className="text-xs font-medium text-slate-200 md:text-sm">
                            {post?.userName}
                        </p>
                        <p className="text-[11px] text-slate-400">Post owner</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default PostItems
