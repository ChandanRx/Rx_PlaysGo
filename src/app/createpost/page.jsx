"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Data from "../../shared/data";
import { useRouter } from "next/navigation";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import app from "../../../firebaseConfig";

const CreatePost = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [input, setInput] = useState({});
  const db = getFirestore(app);

  useEffect(() => {
    if (session) {
      setInput((value) => ({ ...value, userName: session?.user?.name }));
      setInput((value) => ({ ...value, userImage: session?.user?.image }));
      setInput((value) => ({ ...value, email: session?.user?.email }));
    }
  }, [session]);

  const handleSubmitt = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
=======

    // Uncomment to enable field validation:
    // if (!input.title || !input.desc || !input.date || !input.location || !input.game || !input.imageUrl) {
    //   console.error("All fields are required.");
    //   return;
    // }
>>>>>>> 163a8e8ea09507454af996e6007eb24db7f464c2

    try {
      await setDoc(doc(db, 'posts', Date.now().toString()), input);
      alert('Post created successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error writing document: ', error);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput((values) => ({ ...values, [name]: value }));
  };

  return (
    <div className="mt-10 px-4">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-black/40 p-6 text-slate-50 shadow-[0_18px_60px_rgba(0,0,0,0.75)] backdrop-blur md:p-8">
        <p className="mb-6 border-b border-white/10 pb-3 text-center text-xl font-semibold tracking-tight md:text-2xl">
          Create a new post
        </p>

<<<<<<< HEAD
        <form className="flex flex-col gap-4 text-sm md:text-base" onSubmit={handleSubmitt}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            onChange={handleChange}
            className="rounded-lg border border-white/10 bg-black/40 p-3 text-slate-50 placeholder-slate-400 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/30"
          />

          <textarea
            name="desc"
            placeholder="Write a short description"
            required
            onChange={handleChange}
            className="min-h-[100px] rounded-lg border border-white/10 bg-black/40 p-3 text-slate-50 placeholder-slate-400 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/30"
          />

          <input
            type="date"
            name="date"
            required
            onChange={handleChange}
            className="rounded-lg border border-white/10 bg-black/40 p-3 text-slate-50 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/30"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            required
            onChange={handleChange}
            className="rounded-lg border border-white/10 bg-black/40 p-3 text-slate-50 placeholder-slate-400 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/30"
          />

          <select
            name="game"
            required
            onChange={handleChange}
            className="rounded-lg border border-white/10 bg-black/40 p-3 text-slate-50 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/30"
          >
            <option disabled selected>
              Select game
            </option>
            {Data.GameData.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </select>

          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            required
            onChange={handleChange}
            className="rounded-lg border border-white/10 bg-black/40 p-3 text-slate-50 placeholder-slate-400 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/30"
          />

          <button
            type="submit"
            className="mt-2 rounded-full bg-amber-400 py-3 text-sm font-semibold text-slate-950 shadow-md transition hover:bg-amber-300"
          >
            Publish post
          </button>
        </form>
      </div>
=======
      <form className="flex flex-col text-[#1a1a1a]" onSubmit={handleSubmitt}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          onChange={handleChange}
          className="mb-4 p-3 rounded-md border border-yellow-600 focus:outline-yellow-700"
        />

        <textarea
          name="desc"
          placeholder="Write Description here"
          required
          onChange={handleChange}
          className="mb-4 p-3 rounded-md border border-yellow-600 focus:outline-yellow-700"
        />

        <input
          type="date"
          name="date"
          required
          onChange={handleChange}
          className="mb-4 p-3 rounded-md border border-yellow-600 focus:outline-yellow-700"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          required
          onChange={handleChange}
          className="mb-4 p-3 rounded-md border border-yellow-600 focus:outline-yellow-700"
        />

        <select
          name="game"
          required
          onChange={handleChange}
          className="mb-4 p-3 rounded-md border border-yellow-600 text-[#1a1a1a] bg-white"
        >
          <option disabled selected>
            Select Game
          </option>
          {Data.GameData.map((item) => (
            <option key={item.id}>{item.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          required
          onChange={handleChange}
          className="mb-6 p-3 rounded-md border border-yellow-600 focus:outline-yellow-700"
        />

        <button
          type="submit"
          className="bg-[#1a1a1a] text-yellow-300 font-bold py-3 rounded-md hover:bg-yellow-300 hover:text-[#1a1a1a] transition-colors"
        >
          Submit
        </button>
      </form>
>>>>>>> 163a8e8ea09507454af996e6007eb24db7f464c2
    </div>
  );
};

export default CreatePost;
