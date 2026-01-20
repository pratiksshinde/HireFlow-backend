const routes = require("express").Router();
const { Login, register, logout, me} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload.middleware");

// Login route
routes.post("/login", Login);

// Register route
routes.post("/register", register);

// Logout route
routes.post("/logout", logout);

routes.get("/me", authMiddleware , me);

module.exports = routes;