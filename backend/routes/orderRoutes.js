const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

const protect = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// CREATE ORDER
// ==========================================
router.post("/", protect, async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod
        } = req.body;

        // ==========================================
        // VALIDATE SHIPPING ADDRESS
        // ==========================================
        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.pincode ||
            !shippingAddress.phone
        ) {
            return res.status(400).json({
                message: "Please provide complete shipping address"
            });
        }

        // ==========================================
        // VALIDATE PAYMENT METHOD
        // ==========================================
        const allowedPaymentMethods = [
            "Cash on Delivery",
            "Card",
            "UPI"
        ];

        if (!allowedPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method"
            });
        }

        // ==========================================
        // VALIDATE CART
        // ==========================================
        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        // ==========================================
        // VALIDATE PRODUCTS AND STOCK
        // ==========================================
        for (const item of items) {

            // Validate product ID
            if (
                !mongoose.Types.ObjectId.isValid(
                    item.product
                )
            ) {
                return res.status(400).json({
                    message: "Invalid product ID"
                });
            }

            // Validate quantity
            if (
                !Number.isInteger(item.quantity) ||
                item.quantity <= 0
            ) {
                return res.status(400).json({
                    message: "Invalid quantity"
                });
            }

            // Find product
            const product =
                await Product.findById(
                    item.product
                );

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            // Check stock
            if (
                item.quantity > product.stock
            ) {
                return res.status(400).json({
                    message:
                        `${product.name} does not have enough stock`
                });
            }

            // Save product information in order
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });

            // Calculate total
            totalAmount +=
                product.price * item.quantity;
        }

        // ==========================================
        // REDUCE PRODUCT STOCK
        // ==========================================
        for (const item of items) {

            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        // ==========================================
        // PAYMENT STATUS
        // ==========================================
        let paymentStatus = "Pending";

        // For this project, Card and UPI
        // are simulated as successful payments.
        if (
            paymentMethod === "Card" ||
            paymentMethod === "UPI"
        ) {
            paymentStatus = "Paid";
        }

        // ==========================================
        // CREATE ORDER
        // ==========================================
        const order = await Order.create({
            user: req.userId,

            items: orderItems,

            shippingAddress,

            totalAmount,

            paymentMethod,

            paymentStatus,

            status: "Pending"
        });

        // ==========================================
        // RESPONSE
        // ==========================================
        res.status(201).json({
            message: "Order created successfully",

            order
        });

    } catch (error) {

        console.error(
            "Create Order Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// GET LOGGED-IN USER'S ORDERS
// ==========================================
router.get(
    "/my-orders",
    protect,
    async (req, res) => {

        try {

            const orders =
                await Order.find({
                    user: req.userId
                })
                .sort({
                    createdAt: -1
                });

            res.status(200).json(
                orders
            );

        } catch (error) {

            console.error(
                "Get Orders Error:",
                error.message
            );

            res.status(500).json({
                message: "Server error"
            });
        }
    }
);


// ==========================================
// GET SINGLE ORDER
// ==========================================
router.get(
    "/:id",
    protect,
    async (req, res) => {

        try {

            // Validate order ID
            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {
                return res.status(400).json({
                    message: "Invalid order ID"
                });
            }

            // Find order
            const order =
                await Order.findById(
                    req.params.id
                );

            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            // User can see only their own order.
            // Admin can see any order.
            if (
                order.user.toString() !==
                    req.userId &&
                req.userRole !== "admin"
            ) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

            res.status(200).json(
                order
            );

        } catch (error) {

            console.error(
                "Get Order Error:",
                error.message
            );

            res.status(500).json({
                message: "Server error"
            });
        }
    }
);


// ==========================================
// ADMIN: GET ALL ORDERS
// ==========================================
router.get(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const orders =
                await Order.find()
                    .populate(
                        "user",
                        "name email"
                    )
                    .sort({
                        createdAt: -1
                    });

            res.status(200).json(
                orders
            );

        } catch (error) {

            console.error(
                "Get All Orders Error:",
                error.message
            );

            res.status(500).json({
                message: "Server error"
            });
        }
    }
);


// ==========================================
// ADMIN: UPDATE ORDER STATUS
// ==========================================
router.put(
    "/:id/status",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const {
                status
            } = req.body;

            // Allowed order statuses
            const allowedStatuses = [
                "Pending",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ];

            // Validate status
            if (
                !allowedStatuses.includes(
                    status
                )
            ) {
                return res.status(400).json({
                    message:
                        "Invalid order status"
                });
            }

            // Validate order ID
            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {
                return res.status(400).json({
                    message:
                        "Invalid order ID"
                });
            }

            // Update order status
            const order =
                await Order.findByIdAndUpdate(
                    req.params.id,
                    {
                        status
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );

            if (!order) {
                return res.status(404).json({
                    message:
                        "Order not found"
                });
            }

            res.status(200).json({
                message:
                    "Order status updated successfully",

                order
            });

        } catch (error) {

            console.error(
                "Update Order Status Error:",
                error.message
            );

            res.status(500).json({
                message: "Server error"
            });
        }
    }
);


module.exports = router;