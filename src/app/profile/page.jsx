"use client";
import React, { useEffect, useState } from "react";
import PostItems from "../../components/PostItems";
import { deletePost, dummyUser, getUserPosts } from "../../shared/dummyPosts";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const Profile = () => {
  const [userPost, setUserPost] = useState([]);

  useEffect(() => {
    setUserPost(getUserPosts(dummyUser.email));
  }, []);

  const onDeletePost = (id) => {
    deletePost(id);
    setUserPost(getUserPosts(dummyUser.email));
  };

  return (
    <div className="mt-10 px-4">
      <Card className="mx-auto max-w-6xl p-5 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Your profile
          </h2>
          <p className="mt-1 text-sm text-zinc-700">
            Manage and review your game posts.
          </p>
        </div>

        {userPost?.length === 0 ? (
          <p className="mt-6 text-center text-sm text-zinc-700">
            No posts found yet. Create your first match to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 pb-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {userPost.map((item) => (
              <div key={item.id} className="space-y-2">
                <PostItems post={item} />
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => onDeletePost(item.id)}
                >
                  Delete post
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
