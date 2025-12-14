import Head from "./components/Head";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import SearchPage from "./pages/SearchPage";
import UserProfilePage from "./pages/UserProfilePage";
import MessagePage from "./pages/MessagePage";
import NotificationPage from "./pages/NotificationPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <section className={` ${authUser ? "home" : ""}`}>
        {authUser ? <Head /> : null}
        <div className={` ${authUser ? "page" : ""}`}>

          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="/user/:id" element={authUser ? <UserProfilePage /> : <Navigate to="/login" />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
            <Route path="/messages" element={authUser ? <MessagePage /> : <Navigate to="/login" />} />
            <Route path="/search" element={authUser ? <SearchPage /> : <Navigate to="/login" />} />
            <Route path="/create" element={authUser ? <CreatePostPage /> : <Navigate to="/login" />} />
          </Routes>

        </div>
        <Toaster />
      </section>
    </div>
  );
};
export default App;
