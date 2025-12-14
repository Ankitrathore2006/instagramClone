import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { redirect } from "react-router-dom";

export const usePostStore = create((set, get) => ({
  posts: [],
  userPosts: [],
  selectedPost: null,
  isLoading: false,
  isCreating: false,

  /* ---------------- CREATE POST ---------------- */
  createPost: async (data) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post("/posts/", data);
      set((state) => ({
        posts: [res.data, ...state.posts],
      }));
      toast.success("Post created");
      redirect("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      set({ isCreating: false });
    }
  },

  /* ---------------- GET FEED ---------------- */
  fetchFeed: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/posts/feed");
      set({ posts: res.data });
      return res.data;
    } catch (error) {
      toast.error("Failed to load feed");
    } finally {
      set({ isLoading: false });
    }
  },

  /* ---------------- GET SINGLE POST ---------------- */
  fetchPostById: async (postId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/posts/${postId}`);
      set({ selectedPost: res.data });
    } catch (error) {
      toast.error("Failed to fetch post");
    } finally {
      set({ isLoading: false });
    }
  },

  /* ---------------- GET PROFILE POSTS ---------------- */
  fetchPostsByUser: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/posts/user/${userId}`);
      set({ userPosts: Array.isArray(res.data) ? res.data : [] });
    } catch {
      toast.error("Failed to load profile posts");
      set({ userPosts: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  /* ---------------- SELECT / CLEAR POST ---------------- */
  setSelectedPost: (post) => set({ selectedPost: post }), 
  clearSelectedPost: () => set({ selectedPost: null }),

  /* ---------------- Like ---------------- */
 likePost: async (postId) => {
  try {
    const res = await axiosInstance.post(`/posts/${postId}/like`);

    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId
          ? { ...post, likes: res.data.likes }
          : post
      ),
    }));
  } catch {
    toast.error("Failed to like post");
  }
},
/* ---------------- Unlike ---------------- */
unlikePost: async (postId) => {
  try {
    const res = await axiosInstance.post(`/posts/${postId}/unlike`);

    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId
          ? { ...post, likes: res.data.likes }
          : post
      ),
    }));
  } catch {
    toast.error("Failed to unlike post");
  }
},


  /* ---------------- ADD COMMENT ---------------- */
 addComment: async (postId, text) => {
  try {
    const res = await axiosInstance.post(
      `/posts/${postId}/comment`,
      { text }
    );

    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId
          ? { ...post, comments: res.data.comments }
          : post
      ),
    }));
  } catch {
    toast.error("Failed to add comment");
  }
},

}));