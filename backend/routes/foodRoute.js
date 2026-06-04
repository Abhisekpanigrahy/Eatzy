import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";
import {
    addFood,
    listFood,
    getFood,
    removeFood,
    updateFood,
    addReview
} from "../controllers/foodController.js";

const foodRouter = express.Router();

// Use memory storage — file goes to Cloudinary as a buffer
const upload = multer({ storage: multer.memoryStorage() });

foodRouter.get("/list",           listFood);
foodRouter.get("/:id",            getFood);
foodRouter.post("/add",           upload.single("image"), addFood);
foodRouter.post("/update",        upload.single("image"), updateFood);
foodRouter.post("/remove",        removeFood);
foodRouter.post("/review",        authMiddleware, addReview);

export default foodRouter;
