import express from "express";
import {
    loginUser, registerUser, adminLogin,
    sendForgotPasswordOtp, resetPassword,
    getUserProfile, updateUserProfile, listUsers,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register",        registerUser);
userRouter.post("/login",           loginUser);
userRouter.post("/admin",           adminLogin);
userRouter.post("/forgot-password", sendForgotPasswordOtp);
userRouter.post("/reset-password",  resetPassword);
userRouter.get("/profile",          authMiddleware, getUserProfile);
userRouter.post("/profile/update",  authMiddleware, updateUserProfile);
userRouter.get("/list",             listUsers);

export default userRouter;
