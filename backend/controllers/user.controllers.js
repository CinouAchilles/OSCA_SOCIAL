import mongoose from "mongoose";
import User from "../models/user.model.js";
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
