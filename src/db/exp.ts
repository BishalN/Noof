"use client";

import { queryClient } from "@/app/providers";
import { useMutation, useQuery } from "@tanstack/react-query";
import PouchDB from "pouchdb-browser";

import find from "pouchdb-find";
import rel from "relational-pouch";

PouchDB.plugin(find).plugin(rel);

const db = new PouchDB("blogs");

export const blogDB = db.setSchema([
  {
    singular: "blog",
    plural: "blogs",
    relations: {
      author: { belongsTo: "author" },
      comments: { hasMany: "comment" },
    },
  },
  {
    singular: "author",
    plural: "authors",
    relations: {
      blogs: { hasMany: "blog" },
    },
  },
  {
    singular: "comment",
    plural: "comments",
    relations: {
      blog: { belongsTo: "blog" },
    },
  },
]);

export type Blog = {
  title: string;
  content: string;
  // authorID: string;
  author: string;
  id?: string;
};

export type Author = {
  name: string;
  email: string;
  // blogIDs: string[];
  blogs: string[];
  id?: string;
};

export type Comment = {
  content: string;
  // blogID: string;
  blog: string;
  id?: string;
};

export const useCreateBlog = () => {
  return useMutation({
    mutationFn: async (blog: Blog) => {
      const res = await blogDB.rel.save("blog", blog);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useCreateAuthor = () => {
  return useMutation({
    mutationFn: async (author: Author) => {
      const res = await blogDB.rel.save("author", author);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });
};

export const useCreateComment = () => {
  return useMutation({
    mutationFn: async (comment: Comment) => {
      const res = await blogDB.rel.save("comment", comment);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

type GetBlogsResponse = {
  blogs: Blog[];
};
export const useGetBlogs = () => {
  return useQuery<null, Error, GetBlogsResponse>({
    queryFn: async () => {
      const res = await blogDB.rel.find("blog");
      return res;
    },
    queryKey: ["blogs"],
  });
};

type GetBlogResponse = {
  blog: Blog;
};
export const useGetBlog = (id: string) => {
  return useQuery<string, Error, GetBlogResponse>({
    queryFn: async (id) => {
      const res = await blogDB.rel.find("blog", id);
      return res;
    },
    queryKey: ["blog", id],
  });
};

type GetAuthorsResponse = {
  authors: Author[];
};
export const useGetAuthors = () => {
  return useQuery<null, Error, GetAuthorsResponse>({
    queryFn: async () => {
      const res = await blogDB.rel.find("author");
      return res;
    },
    queryKey: ["authors"],
  });
};

type GetAuthorResponse = {
  author: Author;
};
export const useGetAuthor = (id: string) => {
  return useQuery<string, Error, GetAuthorResponse>({
    queryFn: async (id) => {
      const res = await blogDB.rel.find("author", id);
      return res;
    },
    queryKey: ["author", id],
  });
};

type GetCommentsResponse = {
  comments: Comment[];
};
export const useGetComments = () => {
  return useQuery<null, Error, GetCommentsResponse[]>({
    queryFn: async () => {
      const res = await blogDB.rel.find("comment");
      return res;
    },
    queryKey: ["comments"],
  });
};

type GetCommentResponse = {
  comment: Comment;
};
export const useGetComment = (id: string) => {
  return useQuery<string, Error, GetCommentResponse>({
    queryFn: async (id) => {
      const res = await blogDB.rel.find("comment", id);
      return res;
    },
    queryKey: ["comment", id],
  });
};
