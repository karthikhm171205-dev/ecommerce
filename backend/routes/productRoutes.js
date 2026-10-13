const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        console.error("Get Products Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// GET single product
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Get Product Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// CREATE product - Admin only
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            image,
            category,
            stock
        } = req.body;

        if (!name || !description || price === undefined || !category || stock === undefined) {
            return res.status(400).json({
                message: "Please provide all required product fields"
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image,
            category,
            stock
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        console.error("Create Product Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// UPDATE product - Admin only
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Update Product Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// DELETE product - Admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Delete Product Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;