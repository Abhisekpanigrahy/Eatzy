import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not authorized. Login as admin." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.json({ success: false, message: "Access denied. Admins only." });
        }
        next();
    } catch (error) {
        return res.json({ success: false, message: "Invalid or expired token" });
    }
};

export default adminAuth;
