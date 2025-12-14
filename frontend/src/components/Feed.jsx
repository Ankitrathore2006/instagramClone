import React, { useEffect, useState } from "react";
import "./Feed.css";
import profilephoto from "../img/p.jpg";
import PostCard from "./PostCard";
import Story from "./Story";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

export default function Feed() {
  const { fetchFeed, isLoading } = usePostStore();
 const { suggestedUsers, fetchSuggestedUsers, followUser, authUser, logout } = useAuthStore();



  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadFeed = async () => {
      const data = await fetchFeed();
      setPosts(data);
    };
    loadFeed();
  }, []);

useEffect(() => {
  fetchSuggestedUsers();
}, []);

  return (
    <div className="pag">
      <div className="d1">
        

        {/* POSTS */}
        <div className="post pt-11">
          <div className="post-show">
            {isLoading && <p className="text-center pt-5">Loading feed...</p>}

            {!isLoading && posts.length === 0 && (
              <p className="text-center pt-5">No posts yet</p>
            )}

            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                posts={posts}
                setPosts={setPosts}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="d2">
          <Link to="/profile">
        <div className="porfile-d">
          <div>
            <img src={authUser.profilePic} alt="" />
            <div>
              <strong>{authUser.userName}</strong>
              <p>{authUser.fullName}</p>
            </div>
          </div>
          <div className="et">
            <a onClick={logout}>Logout</a>
          </div>
        </div>
          </Link>

        <div className="sugg">
          <div className="sug1">
            <p>Suggested for you</p>
            <a href="/search">See All</a>
          </div>

          {suggestedUsers?.length > 0 ? (
            suggestedUsers.slice(0, 5).map((user) => (
              <div className="porfile-d" key={user._id}>
                <div>
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.userName}
                  />
                  <div>
                    <strong>{user.userName}</strong>
                    <p>{user.fullName}</p>
                  </div>
                </div>

                <div className="et">
                  <button
                    onClick={() => followUser(user._id)}
                    className="text-blue-500 font-semibold"
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 my-5">No suggestions</p>
          )}


          <div className="text1 mt-5">
            <span>© 2025 Instagram from Meta</span>
          </div>
        </div>
      </div>
    </div>
  );
}
