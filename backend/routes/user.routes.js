import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js';
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser } from '../controllers/user.controllers.js';

const router = express.Router();

router.get("/profile/:username",protectRoute,getUserProfile)

router.post("/follow/:id", protectRoute , followUnfollowUser)

router.get("/seggested", protectRoute ,getSuggestedUsers )

router.post("/update" , protectRoute , updateUser)

export default router;