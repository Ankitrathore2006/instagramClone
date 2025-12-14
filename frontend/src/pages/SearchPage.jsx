import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const {
    searchUser,
    searchedUsers,
    isSearching,
    followUser,
    unfollowUser,
    following,
    authUser,
  } = useAuthStore();

  const [query, setQuery] = useState("");

  // Debounce search (Instagram-like)
  useEffect(() => {
    const delay = setTimeout(() => {
      searchUser(query);
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  const isFollowing = (userId) =>
    following.some((u) => u._id === userId);

  return (
    <div className=" mx-auto pt-20 px-4">
      
      {/*  SEARCH BAR */}
      <div className="flex items-center gap-3 w-[25rem]  bg-base-200 px-4 py-3 rounded-full">
        <Search className="text-zinc-400 w-4xl" size={18} />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* ⏳ LOADING */}
      {isSearching && (
        <p className="text-center mt-6 text-zinc-400">
          Searching...
        </p>
      )}

      {/*  USERS LIST */}
      <div className="mt-6 space-y-4">
        {!isSearching && searchedUsers.length === 0 && query && (
          <p className="text-center text-zinc-400">
            No users found
          </p>
        )}

        {searchedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between"
          >
            {/* USER INFO */}
            <Link
              to={`/user/${user._id}`}
              className="flex items-center gap-3"
            >
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="w-11 h-11 rounded-full object-cover"
              />

              <div>
                <p className="font-medium text-sm">
                  {user.userName}
                </p>
                <p className="text-xs text-zinc-400">
                  {user.fullName}
                </p>
              </div>
            </Link>

            {/* FOLLOW BUTTON */}
            {user._id !== authUser?._id && (
              isFollowing(user._id) ? (
                <button
                  onClick={() => unfollowUser(user._id)}
                  className="px-4 py-1 text-sm rounded-md border"
                >
                  Following
                </button>
              ) : (
                <button
                  onClick={() => followUser(user._id)}
                  className="px-4 py-1 text-sm rounded-md bg-blue-500 text-white"
                >
                  Follow
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
