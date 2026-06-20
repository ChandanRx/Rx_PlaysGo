"use client"
import React, { useState } from 'react'
import PostItems from '../PostItems'
import PostModal from './PostModal'
import Button from '../ui/Button'

const Posts = ({ posts }) => {
    const [post,setPost] = useState()
    return (
        <section className="mt-8">
            <PostModal post={post}/>
            <div className="grid grid-cols-1 gap-6 px-1 pb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:px-0">
                {posts.map((item) => (
                    <Button
                        variant="ghost"
                        type="button"
                        key={item.id}
                        onClick={() => {
                            document.getElementById('my_modal_1').showModal();
                            setPost(item);
                        }}
                        className="w-full max-w-sm rounded-md p-0 text-left hover:bg-transparent"
                    >
                        <PostItems post={item} />
                    </Button>
                ))}
            </div>
        </section>
    )
}

export default Posts
