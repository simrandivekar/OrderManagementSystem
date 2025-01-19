const { Product } = require("../models");

// Create a new product
exports.addProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        // Validate input
        if (!name || price === undefined || stock === undefined) {
            return res.status(400).json({ message: "All fields (name, price, stock) are required" });
        }
        if (price < 0 || stock < 0) {
            return res.status(400).json({ message: "Price and stock must be non-negative values" });
        }

        const product = await Product.create({
            name,
            price,
            stock
        });

        res.status(201).json({
            message: "Product added successfully",
            product
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
