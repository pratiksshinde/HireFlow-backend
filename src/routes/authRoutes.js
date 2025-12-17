const routes = require("express").Router();
const { Login, register, logout} = require("../controllers/authController");
const upload = require("../middleware/upload.middleware");

// Login route
routes.post("/login", Login);

// Register route
routes.post("/register", register);

// Logout route
routes.post("/logout", logout);



module.exports = routes;