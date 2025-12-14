import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import { Camera, Mail, User, X } from "lucide-react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const {
    userPosts,
    fetchPostsByUser,
    selectedPost,
    setSelectedPost,
    clearSelectedPost,
  } = usePostStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  // Followers & following lists
  const followersList = authUser?.followers || [];
  const followingList = authUser?.following || [];

  useEffect(() => {
    if (authUser?._id) {
      fetchPostsByUser(authUser._id);
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      setSelectedImg(reader.result);
      await updateProfile({ profilePic: reader.result });
    };
  };

  console.log("User Posts:", followingList);
  if (!authUser) return <p className="text-center pt-10">Loading profile...</p>;

  return (
    <div className="h-screen pt-5">
      <div className="max-w-xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Username */}
          <div className="text-sm text-center text-zinc-400 flex items-center gap-2">
            <p className="px-4 py-1 w-[100%] text-zinc-500 font-bold">
              @ {authUser.userName}
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser.email}
              </p>
            </div>
          </div>

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
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <img
                  key={post._id}
                  src={post.imageUrl || post.image}
                  className="h-32 w-full object-cover rounded cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                />
              ))
            ) : (
              <p className="col-span-3 text-center text-zinc-400">
                No posts yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* POST MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 pt-5 overflow-scroll bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-base-100 max-w-lg w-full rounded-lg overflow-hidden relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 z-50 p-2 bg-base-300 rounded-full hover:bg-base-200 transition"
              onClick={clearSelectedPost}
            >
              <X className="w-5 h-5" />
            </button>

            {/* PostCard */}
            <PostCard post={selectedPost} posts={userPosts} setPosts={() => {}} />
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 pt-5 overflow-scroll bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-200 rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-2 right-2"
              onClick={() => setShowFollowersModal(false)}
            >
              <X />
            </button>
            <h3 className="text-lg font-semibold mb-4">Followers</h3>
            <ul className="space-y-2 max-h-80 overflow-y-auto">
        {followersList.length > 0 ? (
          followersList.map((user) => (
              <Link to={`/user/${user}`}>
                  <li key={user} className="flex items-center gap-3">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user.fullName}</span>
                  </li>
              </Link>
                ))
              ) : (
                <p>No followers yet</p>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Following Modal */}
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
          followingList.map((user) => (
            <li key={user}>
              <Link to={`/user/${user}`}>
                <div className="porfile-d flex items-center justify-between p-2 hover:bg-base-300 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <strong>{user.userName}</strong>
                      <p className="text-sm text-zinc-500">{user.fullName}</p>
                    </div>
                  </div>

                  <div className="et">
                    {user.followers?.includes(currentUser?._id) ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault(); 
                          unfollowUser(user._id);
                        }}
                        className="text-red-500 font-semibold"
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault(); 
                          followUser(user._id);
                        }}
                        className="text-blue-500 font-semibold"
                      >
                        Follow
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

      {/* Account Info */}
      <div className="bg-base-300 rounded-xl p-6 max-w-2xl mx-auto mt-6">
        <h2 className="text-lg font-medium mb-4">Account Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-zinc-700">
            <span>Member Since</span>
            <span>{authUser.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Account Status</span>
            <span className="text-green-500">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
