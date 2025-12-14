import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { X } from "lucide-react";
import PostCard from "../components/PostCard";
import { useAuthStore } from "../store/useAuthStore";

const UserProfilePage = () => {
  const { id } = useParams();
  const { authUser, followUser, unfollowUser } = useAuthStore();

  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchUserById = async (userId) => {
    try {
      if (!userId) return null;
      const res = await axiosInstance.get(`/auth/user/${userId}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const fetchPostsByUser = async (userId) => {
    if (!userId) return;
    setLoadingPosts(true);
    try {
      const res = await axiosInstance.get(`/posts/user/${userId}`);
      setUserPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setUserPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoadingProfile(true);
      const userData = await fetchUserById(id);
      if (userData?._id) {
        setUser(userData);
        await fetchPostsByUser(userData._id);
      } else {
        setUser(null);
      }
      setLoadingProfile(false);
    };
    loadProfile();
  }, [id]);

  if (loadingProfile) return <p className="text-center pt-10">Loading profile...</p>;
  if (!user) return <p className="text-center pt-10">User not found</p>;

  const followersList = user.followers || [];
  const followingList = user.following || [];

  const isFollowing =
    authUser &&
    followersList.some((f) =>
      typeof f === "string" ? f === authUser._id : f._id === authUser._id
    );

  const handleFollowToggle = async () => {
    if (!authUser || authUser._id === user._id) return;
    try {
      setFollowLoading(true);
      if (isFollowing) {
        await unfollowUser(user._id);
      } else {
        await followUser(user._id);
      }
      const updatedUser = await fetchUserById(user._id);
      setUser(updatedUser);
    } catch (error) {
      console.error("Follow toggle failed:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="h-screen pt-5">
      <div className="max-w-xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">{user.userName}'s Profile</h1>
            <p className="mt-2">User information</p>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={user.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4"
            />
          </div>

          {/* Full Name */}
          <div className="text-center text-sm text-zinc-400">
            <p className="px-4 py-1 text-zinc-500 font-bold">{user.fullName}</p>
          </div>

          {/* FOLLOW BUTTON */}
          {authUser && authUser._id !== user._id && (
            <div className="flex justify-center">
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition
                  ${
                    isFollowing
                      ? "bg-base-200 hover:bg-red-500 hover:text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }
                `}
              >
                {followLoading
                  ? "Please wait..."
                  : isFollowing
                  ? "Unfollow"
                  : "Follow"}
              </button>
            </div>
          )}

          {/* Followers / Following */}
          <div className="flex justify-around mt-6">
            <div
              className="text-center cursor-pointer"
              onClick={() => setShowFollowersModal(true)}
            >
              <strong>{followersList.length}</strong>
              <p>Followers</p>
            </div>
            <div
              className="text-center cursor-pointer"
              onClick={() => setShowFollowingModal(true)}
            >
              <strong>{followingList.length}</strong>
              <p>Following</p>
            </div>
          </div>

          {/* POSTS GRID */}
          <div className="grid grid-cols-3 gap-2 mt-4 border-t pt-4 border-zinc-300">
            {loadingPosts ? (
              <p className="col-span-3 text-center text-zinc-400">Loading posts...</p>
            ) : userPosts.length > 0 ? (
              userPosts.map((post) => (
                <img
                  key={post._id}
                  src={post.imageUrl || post.image}
                  className="h-32 w-full object-cover rounded cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                />
              ))
            ) : (
              <p className="col-span-3 text-center text-zinc-400">No posts yet</p>
            )}
          </div>
        </div>
      </div>

      {/* POST MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 pt-5 overflow-scroll bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-base-100 max-w-lg w-full rounded-lg overflow-hidden relative">
            <button
              className="absolute top-2 right-2 z-50 p-2 bg-base-300 rounded-full"
              onClick={() => setSelectedPost(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <PostCard post={selectedPost} posts={userPosts} setPosts={() => {}} />
          </div>
        </div>
      )}

      {/* FOLLOWERS MODAL */}
      {showFollowersModal && (
        <div className="fixed inset-0 pt-5 overflow-scroll bg-black bg-opacity-50 flex justify-center items-start z-50">
          <div className="bg-base-200 rounded-lg p-6 w-96 relative mt-10">
            <button
              className="absolute top-2 right-2"
              onClick={() => setShowFollowersModal(false)}
            >
              <X />
            </button>
            <h3 className="text-lg font-semibold mb-4">Followers</h3>
            <ul className="space-y-2 max-h-80 overflow-y-auto">
              {followersList.length > 0 ? (
                followersList.map((follower) => (
                  <li key={follower._id || follower}>
                    <Link to={`/user/${typeof follower === "string" ? follower : follower._id}`}>
                      <div className="porfile-d flex items-center justify-between p-2 hover:bg-base-300 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-3">
                          <img
                            src={follower.profilePic || "/avatar.png"}
                            alt={follower.fullName || "User"}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <strong>{follower.userName || follower.fullName}</strong>
                            <p className="text-sm text-zinc-500">{follower.fullName}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-400 my-5">No followers yet</p>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* FOLLOWING MODAL */}
      {showFollowingModal && (
        <div className="fixed inset-0 pt-5 overflow-scroll bg-black bg-opacity-50 flex justify-center items-start z-50">
          <div className="bg-base-200 rounded-lg p-6 w-96 relative mt-10">
            <button
              className="absolute top-2 right-2"
              onClick={() => setShowFollowingModal(false)}
            >
              <X />
            </button>
            <h3 className="text-lg font-semibold mb-4">Following</h3>
            <ul className="space-y-2 max-h-80 overflow-y-auto">
              {followingList.length > 0 ? (
                followingList.map((following) => (
                  <li key={following._id || following}>
                    <Link to={`/user/${typeof following === "string" ? following : following._id}`}>
                      <div className="porfile-d flex items-center justify-between p-2 hover:bg-base-300 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-3">
                          <img
                            src={following.profilePic || "/avatar.png"}
                            alt={following.userName || "User"}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <strong>{following.userName || following.fullName}</strong>
                            <p className="text-sm text-zinc-500">{following.fullName}</p>
                          </div>
                        </div>
                        <div className="et">
                          {authUser && authUser._id !== (following._id || following) && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                (following.followers?.includes(authUser._id)
                                  ? unfollowUser
                                  : followUser
                                )(typeof following === "string" ? following : following._id);
                              }}
                              className={`font-semibold ${
                                following.followers?.includes(authUser._id)
                                  ? "text-red-500"
                                  : "text-blue-500"
                              }`}
                            >
                              {following.followers?.includes(authUser._id) ? "Unfollow" : "Follow"}
                            </button>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-400 my-5">No following yet</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
