const { where } = require("sequelize");
const { sequelize } = require("../config/db");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Resume } = require("../models");



const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Email or Password is incorrect" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Email or Password is incorrect" });
        }

        const resume = await Resume.findOne({ where: { userId: user.id } });
        const isResume = resume ? true : false;
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            samesite: "none",
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        })

        return res.status(200).json({ message: "Login Successful", userName: user.username, userId: user.id, isResume });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "username, email and password are required" });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: passwordHash });
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        samesite: "strict",
    });
    return res.status(200).json({ message: "Logout Successful" });
}

const me = (req,res) =>{
    try {
        const user = req.user.id;
        const username = req.user.username;
        return res.status(200).json({user,username});
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports = { Login, register, logout, me };