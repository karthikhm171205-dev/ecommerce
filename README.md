# 🛒 E-Commerce Web Application

A full-stack e-commerce web application built using **React.js, Node.js, Express.js, and MongoDB**. The application provides product browsing, authentication, role-based admin access, shopping cart functionality, checkout, and order tracking.

## 🌐 Live Demo

**Frontend:**
https://ecommerce-app-qr67.onrender.com

**Backend API:**
https://ecommerce-ad0t.onrender.com

## 📌 Features

### 👤 User Features

* User registration and login
* JWT-based authentication
* Secure password hashing using bcrypt
* User profile
* Browse products
* Search and category filtering
* View product details
* Add products to cart
* Update cart quantities
* Remove products from cart
* Checkout
* Select payment method
* View order history
* Track order status

### 👑 Admin Features

* Admin authentication
* Role-based authorization
* Admin dashboard
* Add new products
* Update products
* Delete products
* View all orders
* Update order status

### 📦 Product Management

* Product name
* Product description
* Product price
* Product image
* Product category
* Product stock
* Automatic stock reduction after order placement

### 📋 Order Management

* Create orders
* Store customer information
* Store ordered products and quantities
* Calculate total order amount
* Payment method selection
* Payment status
* Order status tracking

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* bcryptjs
* Role-based authorization
* Environment variables

### Deployment

* GitHub
* Render

## 📁 Project Structure

```text
ecommerce/
│
├── backend/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   │
│   ├── package.json
│   ├── seedProducts.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── AdminDashboard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── ProductDetails.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
```

## 🔐 Authentication

The application uses JWT-based authentication.

### Registration

```http
POST /api/auth/register
```

Example request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

A JWT token is returned after successful authentication.

Protected requests use:

```http
Authorization: Bearer <token>
```

## 🛍️ Product API

### Get All Products

```http
GET /api/products
```

### Get Single Product

```http
GET /api/products/:id
```

### Create Product

Admin access required.

```http
POST /api/products
```

### Update Product

Admin access required.

```http
PUT /api/products/:id
```

### Delete Product

Admin access required.

```http
DELETE /api/products/:id
```

## 📦 Order API

### Create Order

```http
POST /api/orders
```

### Get User Orders

```http
GET /api/orders/my-orders
```

### Get Single Order

```http
GET /api/orders/:id
```

### Get All Orders

Admin access required.

```http
GET /api/orders
```

### Update Order Status

Admin access required.

```http
PUT /api/orders/:id/status
```

Supported order statuses:

```text
Pending
Processing
Shipped
Delivered
Cancelled
```

## 💳 Payment Methods

The application currently supports:

* Cash on Delivery
* Card
* UPI

Card and UPI payments are currently implemented as **simulated payment methods for demonstration purposes**. No real payment information is processed or stored.

## ⚙️ Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/karthikhm171205-dev/ecommerce.git
```

```bash
cd ecommerce
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend:

```bash
npm start
```

For development:

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The Vite development server will provide a local URL, usually:

```text
http://localhost:5173
```

## 🌱 Seed Products

The project includes a product seeding script containing sample products.

From the backend folder:

```bash
node seedProducts.js
```

This adds the sample products to MongoDB.

## 🚀 Deployment

### Backend

The backend is deployed using Render.

```text
https://ecommerce-ad0t.onrender.com
```

Backend configuration:

```text
Build Command:
npm install

Start Command:
npm start
```

### Frontend

The React frontend is deployed as a Render Static Site.

```text
https://ecommerce-app-qr67.onrender.com
```

Configuration:

```text
Root Directory:
frontend

Build Command:
npm install && npm run build

Publish Directory:
dist
```

## 🔒 Environment Variables

Sensitive environment variables should not be committed to GitHub.

The backend uses:

```text
MONGO_URI
JWT_SECRET
PORT
```

The `.env` file is excluded through `.gitignore`.

## 📸 Application Workflow

```text
User
 │
 ├── Register / Login
 │
 ├── Browse Products
 │
 ├── View Product Details
 │
 ├── Add to Cart
 │
 ├── Checkout
 │
 ├── Select Payment Method
 │
 └── Place Order
          │
          ▼
       MongoDB
          │
          ▼
    Order Tracking
```

Admin workflow:

```text
Admin Login
     │
     ▼
Admin Dashboard
     │
 ┌───┴───────────────┐
 ▼                   ▼
Products            Orders
 │                   │
 ├─ Add              ├─ View
 ├─ Update           └─ Update Status
 └─ Delete
```

## 🎯 Project Objectives

The main objectives of this project are:

* Understand full-stack web application development
* Build RESTful APIs using Express.js
* Integrate MongoDB with a Node.js application
* Implement JWT authentication
* Implement role-based authorization
* Develop a responsive React frontend
* Integrate frontend and backend APIs
* Implement shopping cart and checkout functionality
* Implement order management and tracking
* Deploy a full-stack application using Render

## 🔮 Future Enhancements

* Real payment gateway integration
* Product reviews and ratings
* Wishlist functionality
* Advanced product search
* Pagination
* Email notifications
* Image upload using cloud storage
* Sales analytics for administrators
* Improved order tracking
* Password reset functionality

## 👨‍💻 Author

**Karthik H M**

CSE – Artificial Intelligence and Machine Learning Student

AJ Institute of Engineering and Technology

## 📄 License

This project is developed for educational and learning purposes.
