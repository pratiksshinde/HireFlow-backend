const routes = require("express").Router();
const { Login, register } = require("../controllers/authController");

// Login route
routes.post("/login", Login);

// Register route
routes.post("/register", register);

module.exports = routes;