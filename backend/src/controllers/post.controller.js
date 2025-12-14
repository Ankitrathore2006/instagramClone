import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

/* ---------------- CREATE POST ---------------- */
export const createPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { imageUrl, caption, location } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }

    let uploadedImage = imageUrl;

    if (imageUrl.startsWith("data:image")) {
      const uploadRes = await cloudinary.uploader.upload(imageUrl);
      uploadedImage = uploadRes.secure_url;
    }

    const post = await Post.create({
      user: userId,
      imageUrl: uploadedImage,
      caption,
      location,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("createPost error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ---------------- GET FEED POSTS ---------------- */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 }) 
      .populate("user", "userName profilePic")
      .populate("comments.user", "userName profilePic");

    res.status(200).json(posts);
  } catch (error) {
    console.error("getFeedPosts error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ---------------- GET PROFILE POSTS BY USER ---------------- */
export const getProfilePosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "userName profilePic")
      .populate("comments.user", "userName profilePic");

    res.status(200).json(posts);
  } catch (error) {
    console.error("getProfilePosts error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


/* ---------------- GET SINGLE POST ---------------- */
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("user", "userName profilePic")
      .populate("comments.user", "userName profilePic");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("getPostById error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ---------------- LIKE POST ---------------- */
export const likePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: userId },
    });

    res.status(200).json({ message: "Post liked" });
  } catch (error) {
    console.error("likePost error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ---------------- UNLIKE POST ---------------- */
export const unlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: userId },
    });

    res.status(200).json({ message: "Post unliked" });
  } catch (error) {
    console.error("unlikePost error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ---------------- ADD COMMENT ---------------- */
export const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: { user: userId, text },
        },
      },
      { new: true }
    )
      .populate("comments.user", "userName profilePic");

    res.status(201).json(post.comments);
  } catch (error) {
    console.error("addComment error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
