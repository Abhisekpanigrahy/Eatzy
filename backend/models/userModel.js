import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    role:       { type: String, enum: ["user", "admin"], default: "user" },
    phone:      { type: String, default: "" },
    address:    { type: Object, default: {} },
    image:      { type: String, default: "" },
    cartData:   { type: Object, default: {} },
    newsletter: { type: Boolean, default: false }
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
