import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from 'cloudinary'
import Notification from "../models/notification.models.js";

export const getUserProfile = async(req, res)=>{
    const {username} = req.params;
    try {
        const user = await User.findOne({username}).select("-password");
        if(!user){
            return res.status(404).json({error: "User Not Found"})
        }
        res.status(200).json(user);

    } catch (error) {
        console.error("Error in user controllers: ",error.message);
        res.status(500).json({error: error.message});
    }
}


export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid User ID" });
        }
        const currentUserId = req.user._id;

        if (id == currentUserId) {
            return res.status(400).json({ error: "You can't follow/unfollow yourself" });
        }
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(currentUserId);

        if (!userToModify || !currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow the user
            await Promise.all([
                User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } }),
                User.findByIdAndUpdate(currentUserId, { $pull: { following: id } })
            ]);
            
            return res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // Follow the user
            await Promise.all([
                User.findByIdAndUpdate(id, { $push: { followers: currentUserId } }),
                User.findByIdAndUpdate(currentUserId, { $push: { following: id } })
            ]);

            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
                content: `${currentUser.username} followed you`,
            });
            await newNotification.save();

            return res.status(200).json({ message: "User followed successfully" });
        }

    } catch (error) {
        console.error("Error in user controllers: ", error.message);
        return res.status(500).json({ error: error.message });
    }
};


// Function to get suggested users, enhancing logic with mutual followers, new users, etc.
export const getSuggestedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Fetch the current user, excluding the password
        const currentUser = await User.findById(currentUserId).select("following");

        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get the list of user IDs that the current user is following
        const followingIds = currentUser.following;

        // Suggested users query:
        // Exclude the current user and those already followed by the user.
        // Add a "limit" to avoid overwhelming the client with too many suggestions.
        const suggestedUsers = await User.aggregate([
            {
                // Stage 1: Match users that are neither the current user nor followed by the current user
                $match: {
                    _id: { $nin: [...followingIds, currentUserId] },
                },
            },
            {
                // Stage 2: Optionally sort users by criteria (e.g., randomize or by mutual followers)
                $addFields: {
                    mutualFollowersCount: {
                        $size: {
                            $setIntersection: ["$followers", followingIds],
                        },
                    },
                },
            },
            {
                // Stage 3: Sort by the number of mutual followers (descending), and then randomize
                $sort: {
                    mutualFollowersCount: -1, // Prioritize users with more mutual followers
                },
            },
            {
                // Stage 4: Limit the number of suggestions to 10 (can adjust based on needs)
                $limit: 10,
            },
            {
                // Stage 5: Remove password field before returning
                $project: {
                    password: 0,
                },
            },
        ]);

        // If no suggested users were found
        if (suggestedUsers.length === 0) {
            return res.status(200).json({ message: "No suggestions at the moment." });
        }

        // Return the list of suggested users
        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.error("Error in user controllers:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const deleteImage = async (imageUrl) => {
    if (!imageUrl) return;
    const public_id = imageUrl.split("/").slice(-1)[0].split(".")[0]; // Extract correct public_id
    await cloudinary.uploader.destroy(public_id);
};

// Reusable function to upload an image
const uploadImage = async (img, folder) => {
    if (!img || img.trim() === "") return null;
  
    // Skip if the image is already a URL
    if (img.startsWith("http") || img.startsWith("https")) {
      return img;
    }
  
    // Validate Base64 image format
    if (!img.startsWith("data:image")) {
      throw new Error("Invalid image format. Please upload a valid image file.");
    }
  
    try {
      // Upload to Cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(img, {
        folder,
        resource_type: "image",
      });
      return uploadedResponse.secure_url;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  };


export const updateUser = async (req, res) => {
    try {
      const userId = req.user._id;
      const { username, fullname, email, oldPassword, newPassword, bio, link } = req.body;
      let { profileImg, coverImg } = req.body;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });
  
      // Handle Password Update
      if (oldPassword || newPassword) {
        if (!oldPassword || !newPassword) {
          return res.status(400).json({ error: "Please provide both old and new passwords." });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect current password." });
        if (newPassword.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });
  
        user.password = await bcrypt.hash(newPassword, 10);
      }
  
      // Handle Profile Image Upload
      if (profileImg) {
        if (user.profileImg && user.profileImg !== "https://placehold.co/200x200") {
          await deleteImage(user.profileImg); // Delete old image
        }
        user.profileImg = await uploadImage(profileImg, "users");
      }
  
      // Handle Cover Image Upload
      if (coverImg) {
        if (user.coverImg) {
          await deleteImage(user.coverImg); // Delete old image
        }
        user.coverImg = await uploadImage(coverImg, "users");
      }
  
      // Update user details
    if (username && username !== user.username) user.username = username;
    if (fullname && fullname !== user.fullname) user.fullname = fullname;
    if (email && email !== user.email) user.email = email;
    if (bio && bio !== user.bio) user.bio = bio;
    if (link && link !== user.link) user.link = link;
  
      await user.save();
      const updatedUser = await User.findById(userId).select("-password"); // Exclude password
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error in updateUser controller:", error);
      res.status(500).json({ error: error.message || "An error occurred while updating your profile." });
    }
};

export const getAllUsers = async (req , res)=>{
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in user controllers: ",error.message);
        throw new Error(error.message);
    }
}