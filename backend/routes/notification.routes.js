import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { deleteNotifications, getNotifications, markNotificationAsRead } from '../controllers/notification.controllers.js';

const router = express.Router();

router.get("/", protectRoute , getNotifications ) 
router.delete("/", protectRoute , deleteNotifications) 
router.put("/:id", protectRoute , markNotificationAsRead) 

export default router;