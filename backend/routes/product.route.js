const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.post("", productController.addProduct);

module.exports = router;
