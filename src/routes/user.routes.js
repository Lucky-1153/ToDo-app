import { Router } from "express";
import {logout, registerUser, loginUser, refreshAccessToken} from '../controllers/user.controller.js'
import { jwtVerify } from "../middleware/auth.middleware.js";

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(
    jwtVerify,
    logout)
router.route('/refresh-token').post(refreshAccessToken)

export default router