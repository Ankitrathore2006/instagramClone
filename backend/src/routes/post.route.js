import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPost,
  getFeedPosts,
  getPostById,
  likePost,
  unlikePost,
  addComment,
  getProfilePosts,
} from "../controllers/post.controller.js";

const router = express.Router();

/* ------------------ POSTS ------------------ */

router.post("/", protectRoute, createPost);

/* Get feed (posts from following users) */
router.get("/feed", protectRoute, getFeedPosts);
router.get("/user/:userId", protectRoute, getProfilePosts);

/* Get single post by ID */
router.get("/:postId", protectRoute, getPostById);

/* ------------------ INTERACTIONS ------------------ */

/* Like a post */
router.post("/:postId/like", protectRoute, likePost);

/* Unlike a post */
router.post("/:postId/unlike", protectRoute, unlikePost);

/* Add comment to a post */
router.post("/:postId/comment", protectRoute, addComment);

export default router;
