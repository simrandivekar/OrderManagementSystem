const { User } = require("../models");

// Add a new user
exports.addUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validate input
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        // Check for duplicate email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const user = await User.create({
            name,
            email
        });
        res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
