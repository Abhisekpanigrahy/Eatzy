# 🍕 Eatzy - Full Stack Food Delivery Platform

Eatzy is a premium, full-featured MERN stack application designed to provide a seamless food ordering experience. It features a beautiful, responsive user interface, a powerful admin dashboard, and a secure backend with Stripe payment integration.

---

## 🌟 Key Features

### 🛒 Customer Experience (Frontend)
- **Responsive UI**: Pixel-perfect design optimized for Desktop, Tablet, and Mobile.
- **Smart Search & Filters**: Quickly find dishes by name or category with real-time filtering.
- **Advanced Auth**: Secure JWT-based login/registration with **OTP-based Password Reset**.
- **Wishlist & Cart**: Manage favorite dishes and track orders with a persistent shopping cart.
- **Stripe Payments**: Securely process credit card transactions or choose Cash on Delivery (COD).
- **Mobile Optimized**: Mobile-first design with a dedicated app download section for the Eatzy APK.

### 🛠️ Admin Dashboard
- **Inventory Control**: Add, edit, and remove dishes with image upload support via Cloudinary.
- **Order Management**: Real-time order tracking and status updates (Processing → Out for delivery → Delivered).
- **User Analytics**: Overview of registered users and order history.
- **Modern UI**: Clean, intuitive interface for effortless management.

### 🔐 Backend & Security
- **RESTful API**: Scalable architecture built with Express and Node.js.
- **Database**: MongoDB for flexible and efficient data storage.
- **Image Hosting**: Cloudinary integration for optimized asset management.
- **Security**: Password hashing with Bcrypt and protected routes via middleware.

---

## 🚀 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Vite, React Router, React Toastify, Axios |
| **Backend** | Node.js, Express.js, JWT, Bcrypt |
| **Database** | MongoDB with Mongoose ODM |
| **Payments** | Stripe API |
| **Storage** | Cloudinary (Images), Local Storage (Tokens) |

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/eatzy-food-delivery.git
cd eatzy-food-delivery
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_CLOUD_NAME=name
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Admin Setup
```bash
cd ../admin
npm install
npm run dev
```

---

##  Project Structure
```text
Eatzy/
├── frontend/     # Customer React application (Vite)
├── admin/        # Admin dashboard (React)
├── backend/      # Express API & Database models
├── mobile/       # React Native / Expo mobile application
└── README.md
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contact
Abhishek Panigrahy - [Your Email/Portfolio] - [LinkedIn]

---
*Built with ❤️ for a better dining experience.*
