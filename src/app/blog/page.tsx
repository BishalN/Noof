// This page is for experimental purpose to understand the pouchdb-relation apis

"use client";

import {
  Author,
  Blog,
  useCreateAuthor,
  useCreateBlog,
  useGetAuthors,
  useGetBlogs,
} from "@/db/exp";
import React, { useState } from "react";

export default function Page() {
  const [blog, setBlog] = useState<Blog>({
    author: "",
    title: "",
    content: "",
  });

  const [author, setAuthor] = useState<Author>({
    name: "",
    email: "",
    blogs: [],
  });

  const {
    mutateAsync: createBlog,
    data: createdBlog,
    isLoading: createBlogLoading,
  } = useCreateBlog();

  const handleCreateBlog = async () => {
    await createBlog(blog);
    setBlog({ author: "", title: "", content: "" });
  };

  const {
    mutateAsync: createAuthor,
    data: createdAuthor,
    isLoading: authorCreateLoading,
  } = useCreateAuthor();

  const handleCreateAuthor = async () => {
    await createAuthor(author);
    setAuthor({ name: "", email: "", blogs: [] });
  };

  const { data: blogs, isLoading: blogsLoading } = useGetBlogs();
  const { data: authors, isLoading: authorsLoading } = useGetAuthors();

  if (authorsLoading || blogsLoading) return <p>Loading...</p>;

  console.log("authors", JSON.stringify(authors, null, 2));

  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <form className="flex flex-col">
        <h1 className="my-4">Create Author</h1>
        <label htmlFor="author">Author Name</label>
        <input
          type="text"
          className="border-2 border-gray-500 rounded-md p-2"
          value={author?.name}
          onChange={(e) => setAuthor({ ...author, name: e.target.value })}
        />

        <label htmlFor="email">Author Email</label>
        <input
          type="email"
          name="email"
          className="border-2 border-gray-500 rounded-md p-2"
          value={author?.email}
          onChange={(e) => setAuthor({ ...author, email: e.target.value })}
        />

        <button
          type="button"
          onClick={handleCreateAuthor}
          className="border-2 my-4 border-gray-500 rounded-md p-2"
        >
          {authorCreateLoading ? "Creating..." : "Create Author"}
        </button>

        <h1 className="my-4">Create blog</h1>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          className="border-2 border-gray-500 rounded-md p-2"
          value={blog?.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          placeholder="Title"
        />

        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          id="content"
          className="border-2 border-gray-500 rounded-md p-2"
          cols={30}
          rows={10}
          value={blog?.content}
          onChange={(e) => setBlog({ ...blog, content: e.target.value })}
        />

        <label htmlFor="chooseAuthor">Choose Author</label>
        <select
          className="border-2 border-gray-500 rounded-md p-2"
          name="chooseAuthor"
          id="chooseAuthor"
          value={blog?.author}
          onChange={(e) => setBlog({ ...blog, author: e.target.value })}
        >
          {authors?.authors.map((author) => {
            return (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            );
          })}
          ;
        </select>

        <button
          type="button"
          onClick={handleCreateBlog}
          className="border-2 my-4 border-gray-500 rounded-md p-2"
        >
          {createBlogLoading ? "Creating..." : "Create Blog"}
        </button>
      </form>

      <div className="">
        <h1>Authors</h1>
        {authorsLoading ? <p>Loading...</p> : null}
        {authors?.authors.map((author) => {
          return (
            <div key={author.id} className="my-4 bg-slate-400 p-2 rounded-sm">
              <p>{author.id}</p>
              <p>{author.name}</p>
              <p>{author.email}</p>
            </div>
          );
        })}

        <h1 className="my-4">Blogs</h1>
        {blogsLoading ? <p>Loading...</p> : null}
        {blogs?.blogs.map((blog) => {
          return (
            <div key={blog.id} className="my-4 bg-slate-400 p-2 rounded-sm">
              <p>{blog.id}</p>
              <p>{blog.title}</p>
              <p>{blog.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
