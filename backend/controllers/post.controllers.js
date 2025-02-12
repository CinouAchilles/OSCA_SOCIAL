import Notification from "../models/notification.models.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  try {
    let { text, img } = req.body;
    let userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (!text && !img) {
      return res.status(400).json({ error: "Post must contain text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img, {
        folder: "posts",
        resource_type: "image",
      });
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    if (!postId) return res.status(400).json({ error: "Post id is required" });

    // Validate if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgPath = post.img.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(`posts/${imgPath}`);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id.toString();

    if (!text)
      return res.status(400).json({ error: "Comment text is required" });
    if (!postId) return res.status(400).json({ error: "Post id is required" });

    const post = await Post.findById(postId).populate("user", "username profileImg");

    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = {
      text,
      user: userId,
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the newly added comment
    const populatedPost = await Post.findById(postId)
      .populate("comments.user", "username profileImg") // ✅ Populate comment user details
      .exec();

    const addedComment = populatedPost.comments[populatedPost.comments.length - 1];

    // Send only the new comment, not the whole post
    res.status(200).json({ comment: addedComment });
  } catch (error) {
    console.error("Error commenting on post: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { id: postId } = req.params;

    if (!postId) return res.status(400).json({ error: "Post id is required" });

    // Validate if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const likedPost = post.likes.includes(userId);
    if (likedPost) {
      // Unlike the post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne(
        { _id: userId },
        { $pull: { likedPosts: postId } }
      );
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like the post
      post.likes.push(userId);
      await User.updateOne(
        { _id: userId },
        { $push: { likedPosts: postId } }
      );
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
        content: `${req.user.username} liked your post`,
      });
      await notification.save();
      res.status(201).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("Error liking/unliking post: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    .populate("user", "username fullname profileImg")
    .populate("comments.user", "username profileImg")
    .sort({ createdAt: -1 });


    if (posts.length == 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLikedPosts = async (req, res) => {
    const userId = req.user._id.toString();

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid User ID" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
          .populate("user", "username fullname profileImg")
          .populate("comments.user", "username profileImg")
          .sort({ createdAt: -1 });
            

        res.status(200).json(likedPosts);
    } catch (error) {
        console.error("Error fetching liked posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getFollowingPosts = async (req ,res)=>{
    const userId = req.user._id.toString();

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid User ID" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const following = user.following;
        const followingPosts = await Post.find({user:{$in:following}})
        .sort({ createdAt: -1 })
        .populate("user", "username fullname profileImg") // Populate the 'user' field with the 'username'
        .populate("likes", "_id") // Populate the 'likes' field with user IDs (if needed)
        .populate("comments.user", "username"); // Populate the 'user' field in comments with the 'username'

        res.status(200).json(followingPosts);
    } catch (error) {
        console.error("Error fetching following posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
} 


export const getUserPosts = async (req, res) => {
    const targetUsername = req.params.username;

    try {
        const user = await User.findOne({ username: targetUsername });
        if (!user) return res.status(404).json({ error: "User not found" });

        const userPosts = await Post.find({ user: user._id })
        .populate("user", "username fullname profileImg")
        .populate("comments.user", "username profileImg")
        .sort({ createdAt: -1 });
        res.status(200).json(userPosts);
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};