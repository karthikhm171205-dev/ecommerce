const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// TEST AUTHENTICATION ROUTE
// ==========================================
router.get("/", (req, res) => {
    res.send("Authentication API is working");
});

// ==========================================
// REGISTER USER
// ==========================================
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email and password"
            });
        }

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(
            "Registration Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});

// ==========================================
// LOGIN USER
// ==========================================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(
            "Login Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});

// ==========================================
// GET USER PROFILE
// ==========================================
router.get(
    "/profile",
    protect,
    async (req, res) => {
        try {
            const user =
                await User.findById(
                    req.userId
                ).select("-password");

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.status(200).json({
                message:
                    "Profile accessed successfully",

                user
            });

        } catch (error) {
            console.error(
                "Profile Error:",
                error.message
            );

            res.status(500).json({
                message: "Server error"
            });
        }
    }
);

// ==========================================
// ADMIN TEST ROUTE
// ==========================================
router.get(
    "/admin-test",
    protect,
    adminOnly,
    (req, res) => {
        res.status(200).json({
            message: "Admin access granted"
        });
    }
);

// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports = router;