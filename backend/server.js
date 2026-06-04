import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import newsletterRouter from "./routes/newsletterRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/images", express.static('uploads'));

// Connect services
connectDB();
connectCloudinary();

// API routes
app.use("/api/user",       userRouter);
app.use("/api/food",       foodRouter);
app.use("/api/cart",       cartRouter);
app.use("/api/order",      orderRouter);
app.use("/api/newsletter", newsletterRouter);

// Health check
app.get("/", (req, res) => res.send("Eatzy API Running ✅"));

app.listen(port, "0.0.0.0", () =>
  console.log(`Server started on http://localhost:${port} (LAN: use your machine's IP)`)
);
