import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

const generateToken = (user) =>
    jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields required" });

        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "Email already registered" });

        const user = await User.create({ name, email, password });
        const token = generateToken(user);

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error("Register error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res
                .status(400)
                .json({ message: "Email and password are required" });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid email or password" });

        const match = await user.comparePassword(password);
        if (!match)
            return res.status(400).json({ message: "Invalid email or password" });

        const token = generateToken(user);

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
