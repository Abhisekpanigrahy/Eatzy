import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';
import path from 'path';

const foodRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)
// Note: Vercel has a read-only filesystem. For production, use Cloudinary or S3.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use /tmp for Vercel environments to avoid EROFS errors, 
        // though files will be temporary.
        const uploadPath = process.env.VERCEL ? '/tmp' : 'uploads';
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage})

foodRouter.get("/list",listFood);
foodRouter.post("/add",upload.single('image'),addFood);
foodRouter.post("/remove",removeFood);

export default foodRouter;