const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

// Add a new user
router.post("", userController.addUser);

module.exports = router;
