import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId:  { type: String },
    userName:{ type: String, default: "Anonymous" },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    text:    { type: String, required: true },
    date:    { type: Date, default: Date.now }
});

const foodSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true },
    image:       { type: String, required: true },   // Cloudinary URL
    category:    { type: String, required: true },
    reviews:     [reviewSchema],
    averageRating: { type: Number, default: 0 }
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;
