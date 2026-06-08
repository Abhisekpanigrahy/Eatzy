import subscriberModel from "../models/subscriberModel.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Subscribe to newsletter
const subscribe = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) return res.json({ success: false, message: "Email is required" });

        const exists = await subscriberModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "Already subscribed!" });

        await subscriberModel.create({ email });

        // Send welcome email - don't await so we don't block the response
        // and catch errors so it doesn't crash the request
        if (process.env.SMTP_HOST) {
            transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: "Welcome to Eatzy — You're in! 🍔",
                html: `
                    <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:30px;border:1px solid #f3e8e6;border-radius:12px;">
                        <h2 style="color:#FF4C24;">Welcome to Eatzy! 🎉</h2>
                        <p style="color:#49557E;">You've successfully subscribed to our newsletter.</p>
                        <p style="color:#49557E;">As a thank you, enjoy <strong>20% off</strong> your next order with code:</p>
                        <div style="background:#fff4f2;padding:16px;border-radius:8px;text-align:center;margin:20px 0;">
                            <span style="font-size:24px;font-weight:bold;color:#FF4C24;letter-spacing:3px;">EATZY20</span>
                        </div>
                        <p style="color:#6b7280;font-size:13px;">Stay tuned for exclusive deals, new dishes, and more!</p>
                        <p style="color:#6b7280;font-size:13px;">— The Eatzy Team</p>
                    </div>
                `,
            }).catch((err) => console.error("Email send error:", err));
        }

        res.json({ success: true, message: "Subscribed! Check your email for a 20% off coupon." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Subscription error" });
    }
};

// Admin: list all subscribers
const listSubscribers = async (req, res) => {
    try {
        const subscribers = await subscriberModel.find({}).sort({ subscribedAt: -1 });
        res.json({ success: true, data: subscribers });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching subscribers" });
    }
};

export { subscribe, listSubscribers };
