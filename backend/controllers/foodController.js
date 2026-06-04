import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

// helper: upload buffer to Cloudinary
const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "eatzy/foods", resource_type: "image" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(file.buffer);
    });
};

// GET /api/food/list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching foods" });
    }
};

// GET /api/food/:id
const getFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);
        if (!food) return res.json({ success: false, message: "Food not found" });
        res.json({ success: true, data: food });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

// POST /api/food/add
const addFood = async (req, res) => {
    try {
        if (!req.file) return res.json({ success: false, message: "Image required" });
        const imageUrl = await uploadToCloudinary(req.file);
        const food = new foodModel({
            name:        req.body.name,
            description: req.body.description,
            price:       Number(req.body.price),
            category:    req.body.category,
            image:       imageUrl,
        });
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error adding food" });
    }
};

// POST /api/food/update
const updateFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) return res.json({ success: false, message: "Food not found" });

        const updateData = {
            name:        req.body.name,
            description: req.body.description,
            price:       Number(req.body.price),
            category:    req.body.category,
        };

        if (req.file) {
            // Delete old image from Cloudinary if it's a cloudinary URL
            if (food.image && food.image.includes("cloudinary")) {
                const publicId = food.image.split("/").slice(-2).join("/").split(".")[0];
                await cloudinary.uploader.destroy(publicId).catch(() => {});
            }
            updateData.image = await uploadToCloudinary(req.file);
        }

        await foodModel.findByIdAndUpdate(req.body.id, updateData);
        res.json({ success: true, message: "Food Updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error updating food" });
    }
};

// POST /api/food/remove
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) return res.json({ success: false, message: "Food not found" });

        // Delete from Cloudinary
        if (food.image && food.image.includes("cloudinary")) {
            const publicId = food.image.split("/").slice(-2).join("/").split(".")[0];
            await cloudinary.uploader.destroy(publicId).catch(() => {});
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error removing food" });
    }
};

// POST /api/food/review  (auth required)
const addReview = async (req, res) => {
    try {
        const { foodId, rating, text, userName, userImage } = req.body;
        const food = await foodModel.findById(foodId);
        if (!food) return res.json({ success: false, message: "Food not found" });

        const user = await userModel.findById(req.body.userId);
        
        // Priority: Passed from frontend > Found in DB > Fallback
        const finalName  = userName  || user?.name  || "Anonymous";
        const finalImage = userImage || user?.image || "";

        const review = {
            userId:    req.body.userId,
            userName:  finalName,
            userImage: finalImage,
            rating:    Number(rating),
            text,
            date:      new Date(),
        };
        food.reviews.push(review);
        // Recalculate average
        const avg = food.reviews.reduce((sum, r) => sum + r.rating, 0) / food.reviews.length;
        food.averageRating = Math.round(avg * 10) / 10;
        await food.save();
        res.json({ success: true, message: "Review added", data: food });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error adding review" });
    }
};

export { listFood, getFood, addFood, updateFood, removeFood, addReview };
