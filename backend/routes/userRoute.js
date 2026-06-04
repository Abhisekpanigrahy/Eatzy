import express from "express";
import {
    loginUser,
    registerUser,
    adminLogin,
    getUserProfile,
    updateUserProfile,
    listUsers,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register",       registerUser);
userRouter.post("/login",          loginUser);
userRouter.post("/admin",          adminLogin);
userRouter.get("/profile",         authMiddleware, getUserProfile);
userRouter.post("/profile/update", authMiddleware, updateUserProfile);
userRouter.get("/list",            listUsers);          // admin use

export default userRouter;
