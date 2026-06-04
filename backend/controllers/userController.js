import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "User already exists" });

        if (!validator.isEmail(email))
            return res.json({ success: false, message: "Please enter a valid email" });
        if (password.length < 8)
            return res.json({ success: false, message: "Password must be at least 8 characters" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Registration error" });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Login error" });
    }
};

// Admin login (uses env credentials — no DB user needed)
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign(
                { email, role: "admin" },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );
            return res.json({ success: true, token });
        }
        res.json({ success: false, message: "Invalid admin credentials" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Admin login error" });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId).select("-password");
        if (!user) return res.json({ success: false, message: "User not found" });
        res.json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching profile" });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        await userModel.findByIdAndUpdate(req.body.userId, { name, phone, address });
        res.json({ success: true, message: "Profile updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error updating profile" });
    }
};

// Admin: list all users
const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password").sort({ _id: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching users" });
    }
};

export { registerUser, loginUser, adminLogin, getUserProfile, updateUserProfile, listUsers };
