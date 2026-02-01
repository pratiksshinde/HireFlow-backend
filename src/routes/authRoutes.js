const routes = require("express").Router();
const { Login, register, logout, me} = require("../controllers/authController");
const { initiatePayment, fetchPayments, verifyPayment } = require("../controllers/paymentController");
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload.middleware");

// Login route
routes.post("/login", Login);

// Register route
routes.post("/register", register);

// Logout route
routes.post("/logout", logout);

routes.get("/me", authMiddleware , me);

routes.post("/payment", authMiddleware , initiatePayment);
routes.post("/verify_payment", authMiddleware , verifyPayment);
routes.get("/payment/:payment_id", authMiddleware , fetchPayments);

module.exports = routes;