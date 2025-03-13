const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Register a new user
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "✅ User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("🛠️ Received Login Request:", { email, password });

        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ No user found with this email");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Password does not match");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("✅ Login successful for:", email);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "90d" });
        res.json({ token, user: { id: user._id, email: user.email, name: user.firstName } });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


// ✅ Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ name: user.firstName + " " + user.lastName });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// ✅ Export all functions
module.exports = { registerUser, loginUser, getProfile };
