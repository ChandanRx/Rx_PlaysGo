"use client"
import React, { useState } from 'react'
import PostItems from '../PostItems'
import PostModal from './PostModal'

const Posts = ({ posts }) => {
    const [post,setPost] = useState()
    return (
        <section className="mt-8">
            <PostModal post={post}/>
            <div className="grid grid-cols-1 gap-6 px-1 pb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:px-0">
                {posts.map((item) => (
                    <button
                        type="button"
                        key={item.title}
                        onClick={() => {
                            document.getElementById('my_modal_1').showModal();
                            setPost(item);
                        }}
                        className="text-left"
                    >
                        <PostItems post={item} />
                    </button>
                ))}
            </div>
        </section>
    )
}

export default Posts