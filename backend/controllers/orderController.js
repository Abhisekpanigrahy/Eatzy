import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const DELIVERY_CHARGE = 5;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Place Order — supports Stripe or COD
const placeOrder = async (req, res) => {
    try {
        const { items, amount, address, paymentMethod = "stripe" } = req.body;

        const newOrder = new orderModel({
            userId: req.body.userId,
            items,
            amount,
            address,
            paymentMethod,
            payment: false,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Cash on Delivery — no payment gateway
        if (paymentMethod === "cod") {
            await orderModel.findByIdAndUpdate(newOrder._id, { payment: true, status: "Food Processing" });
            return res.json({
                success: true,
                message: "Order placed with Cash on Delivery",
                orderId: newOrder._id,
                cod: true,
            });
        }

        // Stripe checkout session
        const line_items = items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: "usd",
                product_data: { name: "Delivery Charge" },
                unit_amount: DELIVERY_CHARGE * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error placing order" });
    }
};

// Verify Stripe payment result
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment verified" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed, order cancelled" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Verification error" });
    }
};

// User's own orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId }).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// Admin: all orders
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// Admin: update order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error updating status" });
    }
};

// Post Review for an Order
const reviewOrder = async (req, res) => {
    try {
        const { orderId, rating, comment, userName, userImage } = req.body;
        const user = await userModel.findById(req.body.userId);
        
        await orderModel.findByIdAndUpdate(orderId, {
            reviewed: true,
            rating,
            comment,
            userName:  userName  || user?.name  || "Anonymous",
            userImage: userImage || user?.image || ""
        });
        res.json({ success: true, message: "Review submitted" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error submitting review" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, reviewOrder };
