import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// In-memory OTP store { email -> { otp, expiresAt } }
const otpStore = new Map();

const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

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

// Admin login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
            return res.json({ success: true, token });
        }
        res.json({ success: false, message: "Invalid admin credentials" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Admin login error" });
    }
};

// Send OTP for forgot password
const sendForgotPasswordOtp = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email || !validator.isEmail(email))
            return res.json({ success: false, message: "Please enter a valid email" });

        const user = await userModel.findOne({ email });
        // Always respond same to avoid user enumeration
        if (!user) return res.json({ success: true, message: "If this email exists, an OTP has been sent." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min
        otpStore.set(email, { otp, expiresAt });

        await transporter.sendMail({
            from:    process.env.SMTP_FROM,
            to:      email,
            subject: "Eatzy — Password Reset OTP",
            html: `
                <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:30px;
                            border:1px solid #f3e8e6;border-radius:12px;">
                    <h2 style="color:#FF4C24;">Reset Your Password 🔑</h2>
                    <p style="color:#49557E;">Use the OTP below to reset your Eatzy password.
                       It expires in <strong>10 minutes</strong>.</p>
                    <div style="background:#fff4f2;padding:20px;border-radius:10px;
                                text-align:center;margin:24px 0;">
                        <span style="font-size:36px;font-weight:900;color:#FF4C24;
                                     letter-spacing:8px;">${otp}</span>
                    </div>
                    <p style="color:#6b7280;font-size:13px;">
                        If you did not request this, please ignore this email.</p>
                    <p style="color:#6b7280;font-size:13px;">— The Eatzy Team</p>
                </div>
            `,
        }).catch((err) => console.error("OTP email error:", err));

        res.json({ success: true, message: "If this email exists, an OTP has been sent." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error sending OTP" });
    }
};

// Verify OTP and reset password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        if (!email || !otp || !newPassword)
            return res.json({ success: false, message: "All fields are required" });
        if (newPassword.length < 8)
            return res.json({ success: false, message: "Password must be at least 8 characters" });

        const stored = otpStore.get(email);
        if (!stored) return res.json({ success: false, message: "No OTP requested for this email" });
        if (Date.now() > stored.expiresAt) {
            otpStore.delete(email);
            return res.json({ success: false, message: "OTP has expired. Please request a new one." });
        }
        if (stored.otp !== otp.trim())
            return res.json({ success: false, message: "Invalid OTP. Please try again." });

        const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await userModel.findOneAndUpdate({ email }, { password: hashedPassword });
        otpStore.delete(email);

        res.json({ success: true, message: "Password reset successfully. Please login." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error resetting password" });
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

export {
    registerUser, loginUser, adminLogin,
    sendForgotPasswordOtp, resetPassword,
    getUserProfile, updateUserProfile, listUsers,
};
