"use client";
import React, { useState } from "react";
import Data from "../../shared/data";
import { useRouter } from "next/navigation";
import { createPost } from "../../shared/dummyPosts";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Input, Select, Textarea } from "../../components/ui/FormControls";

const CreatePost = () => {
  const router = useRouter();
  const [input, setInput] = useState({});

  const handleSubmitt = (e) => {
    e.preventDefault();
    createPost(input);
    alert('Post created successfully with demo data!');
    router.push('/profile');
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput((values) => ({ ...values, [name]: value }));
  };

  return (
    <div className="mt-10 px-4">
      <Card className="mx-auto w-full max-w-xl p-6 md:p-8">
        <p className="mb-6 border-b border-[#89f336]/20 pb-3 text-center text-xl font-semibold tracking-tight md:text-2xl">
          Create a new post
        </p>

        <form className="flex flex-col gap-4 text-sm md:text-base" onSubmit={handleSubmitt}>
          <Input
            type="text"
            name="title"
            placeholder="Title"
            required
            onChange={handleChange}
          />

          <Textarea
            name="desc"
            placeholder="Write a short description"
            required
            onChange={handleChange}
          />

          <Input
            type="date"
            name="date"
            required
            onChange={handleChange}
          />

          <Input
            type="text"
            name="location"
            placeholder="Location"
            required
            onChange={handleChange}
          />

          <Select
            name="game"
            required
            onChange={handleChange}
            defaultValue=""
          >
            <option value="" disabled>
              Select game
            </option>
            {Data.GameData.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </Select>

          <Input
            type="text"
            name="imageUrl"
            placeholder="Image URL (optional)"
            onChange={handleChange}
          />

          <Button
            type="submit"
            size="lg"
            className="mt-2"
          >
            Publish post
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreatePost;
