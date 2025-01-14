import mongoose from "mongoose";
import User from "../models/user.model.js";

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

            // Send notification to the user (implement the notification logic here)
            // Example: sendNotification(userToModify._id, currentUserId);

            return res.status(200).json({ message: "User followed successfully" });
        }

    } catch (error) {
        console.error("Error in user controllers: ", error.message);
        return res.status(500).json({ error: error.message });
    }
};
