const { Op } = require("sequelize");
const { User, Product, Order } = require("../models");
const db = require('../models');
const { sequelize } = db;

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { user_id, orders } = req.body;

        // Validate user 
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let orderTotal = 0;

        for (const item of orders) {
            const { product_id, quantity } = item;

            // get product details
            const product = await Product.findByPk(product_id);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${product_id}` });
            }

            // check if stock exists or not
            if (product.stock < quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for product: ${product.name}` 
                });
            }

            // total price
            const itemTotal = product.price * quantity;
            orderTotal += itemTotal;

            // delete order from stco k and save
            await Product.update(
                { stock: product.stock - quantity },
                { where: { id: product_id } }
            );

            await Order.create({
                user_id,
                product_id,
                quantity,
            });
        }

        res.status(201).json({
            message: "Order created successfully",
            total_amount: orderTotal
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getUserOrders = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Validate user exists or not
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const orders = await Order.findAll({
            where: { user_id },
            include: [
                {
                    model: Product,
                    as: "product",  //alias defined in associations
                    attributes: ["name", "price"]
                }
            ],
            order: [["created_at", "DESC"]]
        });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        const result = orders.map(order => ({
            order_id: order.id,
            product_name: order.product.name,
            quantity: order.quantity,
            total_price: order.quantity * order.product.price,
            created_at: order.created_at
        }));

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//  sales report
exports.getSalesReport = async (req, res) => {
    try {
        const salesReport = await Order.findAll({
            attributes: [
                "product_id",
                [sequelize.fn("SUM", sequelize.col("quantity")), "total_quantity_sold"],
                [sequelize.literal("SUM(quantity * product.price)"), "total_sales"]  // Changed 'products' to 'product'
            ],
            include: [
                {
                    model: Product,
                    as: "product",  //alias
                    attributes: ["name"]
                }
            ],
            group: ["product_id", "product.id"],
            order: [[sequelize.literal("total_sales"), "DESC"]]
        });

        const report = salesReport.map(item => ({
            product_id: item.product_id,
            product_name: item.product.name,
            total_quantity_sold: item.dataValues.total_quantity_sold,
            total_sales: parseFloat(item.dataValues.total_sales)
        }));

        res.status(200).json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};