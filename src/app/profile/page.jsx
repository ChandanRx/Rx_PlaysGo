"use client";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import app from "../../../firebaseConfig";
import PostItems from "../../components/PostItems";

const Profile = () => {
  const { data: session } = useSession();
  const db = getFirestore(app);
  const [userPost, setUserPost] = useState([]);

  useEffect(() => {
    if (session?.user?.email) {
      getUserPost();
    }
  }, [session]);

  const getUserPost = async () => {
    const q = query(
      collection(db, "posts"),
      where("email", "==", session?.user?.email)
    );
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      posts.push(data);
    });
    setUserPost(posts);
  };

  const onDeletePost = async (id) => {
    await deleteDoc(doc(db, "posts", id));
    setUserPost((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  return (
    <div className="mt-10 px-4">
      <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-black/40 p-5 text-slate-50 shadow-[0_18px_60px_rgba(0,0,0,0.75)] backdrop-blur md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Your profile
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Manage and review your game posts.
          </p>
        </div>

        {userPost?.length === 0 ? (
          <p className="mt-6 text-center text-sm text-slate-300">
            No posts found yet. Create your first match to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 pb-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {userPost.map((item) => (
              <div key={item.id} className="space-y-2">
                <PostItems post={item} />
                <button
                  className="w-full rounded-full border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
                  onClick={() => onDeletePost(item.id)}
                >
                  Delete post
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
