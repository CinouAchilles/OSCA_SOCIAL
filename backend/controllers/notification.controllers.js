import Notification from "../models/notification.models.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user ID is available in req.user
        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImg"
        });
        await Notification.updateMany({ to: userId }, { read: true });
        return res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ message: 'Error fetching notifications', error: error.message });
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