import React, { useState } from "react";
import Like from "./icons/Like";
import Comment from "./icons/Comment";
import Share from "./icons/Share";
import Save from "./icons/Save";
import UnLike from "./icons/UnLike";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";

export default function PostCard({ post, posts, setPosts }) {
  const { likePost, unlikePost, addComment } = usePostStore();
  const { authUser } = useAuthStore();

  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const profileimg = post?.user?.profilePic || "/avatar.png";
  const profilename = post?.user?.userName || "unknown";
  const posttime = post?.createdAt
    ? new Date(post.createdAt).toDateString()
    : "Just now";
  const location = post?.location || null;
  const postImage = post?.image || post?.imageUrl;
  const likesCount = post?.likes?.length || 0;
  const posttitle = post?.caption || "";

  const isLiked = post?.likes?.includes(authUser?._id);

  /* ---------------- LIKE / UNLIKE (INSTANT UI) ---------------- */
  const handleLike = () => {
    setPosts(
      posts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              likes: isLiked
                ? p.likes.filter((id) => id !== authUser._id)
                : [...p.likes, authUser._id],
            }
          : p
      )
    );

    isLiked ? unlikePost(post._id) : likePost(post._id);
  };

  /* ---------------- ADD COMMENT (INSTANT UI) ---------------- */
  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      text: commentText,
      user: {
        _id: authUser._id,
        username: authUser.userName,
      },
    };

    setPosts(
      posts.map((p) =>
        p._id === post._id
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      )
    );

    addComment(post._id, commentText);
    setCommentText("");
  };

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 max-w-lg mx-auto mb-6">

      {/* Header */}
      <a href={`/user/${post?.user?._id}`} >
        <div className="flex items-center gap-3 p-4">
          <img src={profileimg} alt="profile" className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{profilename}</span>
              <span className="text-sm text-gray-500">• {posttime}</span>
            </div>
            {location && <p className="text-xs text-gray-500">{location}</p>}
          </div>
        </div>
      </a>

      {/* Image */}
      <figure>
        <img src={postImage} alt="post" className="w-full object-cover" />
      </figure>

      {/* Actions */}
      <div className="px-4 pt-3 flex justify-between">
        <div className="flex gap-4 cursor-pointer">
          <span onClick={handleLike}>
            {isLiked ? <Like /> : <UnLike />}
          </span>
          <span onClick={() => setShowComments(true)}>
            <Comment />
          </span>
          <Share />
        </div>
        <Save />
      </div>

      {/* Likes */}
      <div className="px-4 pt-2 text-sm font-semibold">
        {likesCount} likes
      </div>

      {/* Caption */}
      <div className="px-4 pt-1 text-sm">
        <span className="font-semibold mr-2">{profilename}</span>
        {posttitle}
      </div>

      {/* View comments */}
      <div
        onClick={() => setShowComments(true)}
        className="px-4 pt-2 pb-2 text-sm text-gray-500 cursor-pointer"
      >
        View all comments ({post?.comments?.length || 0})
      </div>

      {/* Add comment */}
      <div className="flex items-center gap-2 px-4 py-3 border-t">
        <input
          type="text"
          placeholder="Add a comment..."
          className="input input-ghost w-full"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className="text-primary font-semibold" onClick={handleAddComment}>
          Post
        </button>
      </div>

      {/* COMMENTS MODAL */}
      {showComments && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg">

            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Comments</h2>
              <button onClick={() => setShowComments(false)}>✕</button>
            </div>

            <div className="max-h-80 overflow-y-auto p-4 space-y-3">
              {post?.comments?.length ? (
                post.comments.map((c, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-semibold mr-2">
                      {c?.user?.username}
                    </span>
                    {c?.text}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  No comments yet
                </p>
              )}
            </div>

            <div className="flex gap-2 p-4 border-t">
              <input
                type="text"
                placeholder="Add a comment..."
                className="input input-bordered w-full"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleAddComment}>
                Post
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
