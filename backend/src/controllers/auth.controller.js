import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
   
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const baseUserName = fullName.replace(/\s+/g, "").toLowerCase(); 
    const randomNum = Math.floor(1000 + Math.random() * 9000); 
    let userName = `${baseUserName}${randomNum}`;

    while (await User.findOne({ userName })) {
      const newRandom = Math.floor(1000 + Math.random() * 9000);
      userName = `${baseUserName}${newRandom}`;
    }

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      userName,
    });

    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      userName: newUser.userName,
    });

  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ---------------- FOLLOW USER ---------------- */
export const followUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    if (userId === targetUserId)
      return res.status(400).json({ message: "You cannot follow yourself" });

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    if (user.following.includes(targetUserId))
      return res.status(400).json({ message: "Already following this user" });

    user.following.push(targetUserId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.log("Error in followUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------------- UNFOLLOW USER ---------------- */
export const unfollowUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    if (userId === targetUserId)
      return res.status(400).json({ message: "You cannot unfollow yourself" });

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    user.following = user.following.filter((id) => id.toString() !== targetUserId);
    targetUser.followers = targetUser.followers.filter((id) => id.toString() !== userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.log("Error in unfollowUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------------- GET FOLLOWING LIST ---------------- */
export const getFollowingList = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("following", "_id fullName userName profilePic");

    res.status(200).json(user.following);
  } catch (error) {
    console.log("Error in getFollowingList:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------------- GET FOLLOWERS LIST ---------------- */
export const getFollowersList = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("followers", "_id fullName userName profilePic");

    res.status(200).json(user.followers);
  } catch (error) {
    console.log("Error in getFollowersList:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userSuggestionid = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const currentUser = await User.findById(userId).select("following");

    const following = currentUser?.following || [];

    const allUsers = await User.find({
      _id: { $ne: userId } 
    })
      .select("_id fullName userName profilePic")
      .limit(100);

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error in userSuggestionid:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); 
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



export const SearchUser = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const users = await User.find({
      $or: [
        { fullName: { $regex: safeQuery, $options: "i" } },
        { userName: { $regex: safeQuery, $options: "i" } },
      ],
    })
      .select("_id fullName userName profilePic")
      .limit(10);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in SearchUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


