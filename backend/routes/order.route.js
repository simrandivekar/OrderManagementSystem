const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.post("/orders", orderController.createOrder);
router.get("/orders/:user_id", orderController.getUserOrders);
router.get("/sales-report", orderController.getSalesReport);

module.exports = router;
