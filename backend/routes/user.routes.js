import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js';
import { followUnfollowUser, getSuggestedUsers, getUserProfile } from '../controllers/user.controllers.js';

const router = express.Router();

router.get("/profile/:username",protectRoute,getUserProfile)

router.post("/follow/:id", protectRoute , followUnfollowUser)

router.get("/seggested", protectRoute ,getSuggestedUsers )

export default router;