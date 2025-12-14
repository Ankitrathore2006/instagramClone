import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  followers: [],
  following: [],
  searchedUsers: [],
  isSearching: false,
  suggestedUsers: [],



  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
      get().fetchFollowers();
      get().fetchFollowing();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
      get().fetchFollowers();
      get().fetchFollowing();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
      get().fetchFollowers();
      get().fetchFollowing();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, followers: [], following: [] });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  followUser: async (targetUserId) => {
    try {
      await axiosInstance.put(`/auth/follow/${targetUserId}`);
      toast.success("User followed successfully");
      get().fetchFollowers();
      get().fetchFollowing();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to follow user");
    }
  },

  unfollowUser: async (targetUserId) => {
    try {
      await axiosInstance.put(`/auth/unfollow/${targetUserId}`);
      toast.success("User unfollowed successfully");
      get().fetchFollowers();
      get().fetchFollowing();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unfollow user");
    }
  },

  fetchFollowers: async () => {
    try {
      const res = await axiosInstance.get("/auth/followers");
      set({ followers: res.data });
    } catch (error) {
      console.log("Error fetching followers:", error);
    }
  },

  fetchFollowing: async () => {
    try {
      const res = await axiosInstance.get("/auth/following");
      set({ following: res.data });
    } catch (error) {
      console.log("Error fetching following:", error);
    }
  },


fetchSuggestedUsers: async () => {
  try {
    const res = await axiosInstance.get("/auth/userSuggestionid");
    set({ suggestedUsers: res.data });
  } catch (error) {
    console.log("Error fetching suggested users:", error);
    set({ suggestedUsers: [] });
  }
},


fetchUserById: async (id) => {
  try {
    if (!id) return;
    const res = await axiosInstance.get(`/auth/user/${id}`);
    return res.data; 
  } catch (error) {
    console.log("Error fetching user by ID:", error);
    return null;
  }
},



searchUser: async (query) => {
  if (!query) {
    set({ searchedUsers: [] });
    return;
  }
  
  set({ isSearching: true });
  try {
    const res = await axiosInstance.get(`/auth/SearchUser?query=${query}`);
    set({ searchedUsers: res.data });
  } catch (error) {
    console.log("Error searching users:", error);
  } finally {
    set({ isSearching: false });
  }
},


  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
