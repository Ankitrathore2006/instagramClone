import express from "express";
import { checkAuth, followUser, getFollowersList, getFollowingList, getUserById, login, logout, SearchUser, signup, unfollowUser, updateProfile, userSuggestionid } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.post("/userSuggestionid", protectRoute, userSuggestionid);
router.get("/user/:id", protectRoute, getUserById);

router.get("/SearchUser", protectRoute, SearchUser);

router.get("/check", protectRoute, checkAuth);


router.put("/follow/:targetUserId", protectRoute, followUser);
router.put("/unfollow/:targetUserId", protectRoute, unfollowUser);

router.get("/following", protectRoute, getFollowingList);
router.get("/followers", protectRoute, getFollowersList);


export default router;
