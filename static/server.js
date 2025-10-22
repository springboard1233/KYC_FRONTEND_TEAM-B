const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dns = require("dns");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/smartkyc", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// ------------------ Schemas ------------------
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String }
});

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    adminId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String }
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);

// ------------------ Email setup ------------------
const transporter = nodemailer.createTransport({
    service: "Gmail", // Replace with your service
    auth: {
        user: "youremail@gmail.com",
        pass: "yourpassword"
    }
});

// ------------------ Helpers ------------------
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

async function verifyDomain(email) {
    const domain = email.split("@")[1];
    try {
        const mxRecords = await dns.promises.resolveMx(domain);
        return mxRecords && mxRecords.length > 0;
    } catch {
        return false;
    }
}

// ------------------ Routes ------------------

// User signup
app.post("/signup", async(req, res) => {
    const { email, password, phone } = req.body;

    if (!validateEmail(email)) return res.status(400).json({ error: "Invalid email format" });
    if (!(await verifyDomain(email))) return res.status(400).json({ error: "Email domain invalid" });

    try {
        const existing = await User.findOne({ $or: [{ email }, { phone }] });
        if (existing) return res.status(400).json({ error: "User already exists" });

        const hash = await bcrypt.hash(password, 10);
        const token = crypto.randomBytes(20).toString("hex");
        const newUser = new User({ email, password: hash, phone, verified: false, verificationToken: token });
        await newUser.save();

        const verifyUrl = `http://localhost:5000/verify/${token}`;
        await transporter.sendMail({
            from: '"SmartKYC" <youremail@gmail.com>',
            to: email,
            subject: "Verify your account",
            html: `Click <a href="${verifyUrl}">here</a> to verify your email.`
        });

        res.status(201).json({ message: "User created successfully. Check email to verify." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Admin signup
app.post("/admin/signup", async(req, res) => {
    const { name, adminId, email, password } = req.body;

    if (!validateEmail(email)) return res.status(400).json({ error: "Invalid email format" });
    if (!(await verifyDomain(email))) return res.status(400).json({ error: "Email domain invalid" });

    try {
        const existing = await Admin.findOne({ $or: [{ email }, { adminId }] });
        if (existing) return res.status(400).json({ error: "Admin already exists" });

        const hash = await bcrypt.hash(password, 10);
        const token = crypto.randomBytes(20).toString("hex");
        const newAdmin = new Admin({ name, adminId, email, password: hash, verified: false, verificationToken: token });
        await newAdmin.save();

        const verifyUrl = `http://localhost:5000/admin/verify/${token}`;
        await transporter.sendMail({
            from: '"SmartKYC" <youremail@gmail.com>',
            to: email,
            subject: "Verify your admin account",
            html: `Click <a href="${verifyUrl}">here</a> to verify your admin email.`
        });

        res.status(201).json({ message: "Admin created successfully. Check email to verify." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// User verification
app.get("/verify/:token", async(req, res) => {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).send("Invalid token");

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.send("Email verified! You can now login.");
});

// Admin verification
app.get("/admin/verify/:token", async(req, res) => {
    const admin = await Admin.findOne({ verificationToken: req.params.token });
    if (!admin) return res.status(400).send("Invalid token");

    admin.verified = true;
    admin.verificationToken = undefined;
    await admin.save();
    res.send("Admin email verified! You can now login.");
});

// User login
app.post("/login", async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.verified) return res.status(403).json({ error: "Email not verified" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "User logged in" });
});

// Admin login
app.post("/admin/login", async(req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });
    if (!admin.verified) return res.status(403).json({ error: "Email not verified" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Admin logged in" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
