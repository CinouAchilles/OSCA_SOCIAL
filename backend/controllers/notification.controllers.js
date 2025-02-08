import Notification from "../models/notification.models.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({
            to: userId,
            from: { $ne: userId }, // Exclude self-notifications
        }).populate({
            path: "from",
            select: "username profileImg"
        });

        return res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
};


export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user.id;  
        await Notification.deleteMany({ to: userId });
        return res.status(200).json({ message: 'Notifications deleted successfully' });
    } catch (error) {
        console.error('Error deleting notifications:', error);
        return res.status(500).json({ message: 'Error deleting notifications', error: error.message });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {

        const { id: notificationId } = req.params; 
        const userId = req.user?._id; 

        if (!notificationId) {
            return res.status(400).json({ error: "Notification ID is required" });
        }

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized - User ID is missing" });
        }

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, to: userId },
            { read: true },
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found or does not belong to the user" });
        }

        return res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("❌ Error marking notification as read:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

