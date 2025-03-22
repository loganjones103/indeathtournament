const express = require("express");
const passport = require("passport");
const User = require("../models/User"); // ✅ Import User model
const { requireAuth } = require("../middlewares/authMiddleware"); // ✅ Import requireAuth

const router = express.Router();

// ✅ Google OAuth Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect(`${CLIENT_URL}?loggedIn=true`);
    }
);

// ✅ Logout
router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) {
            console.error("Logout Error:", err);
            return res.status(500).json({ message: "Logout failed" });
        }
        req.session.destroy(() => {
            res.clearCookie("connect.sid", { path: "/", httpOnly: true });
            return res.json({ message: "Logged out successfully" });
        });
    });
});


// ✅ Get Logged-In User
router.get("/user", (req, res) => {
    console.log("User Session:", req.session);
    console.log("Authenticated User:", req.user);

    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    res.json(req.user);
});

router.get("/debug-session", (req, res) => {
    console.log("🔍 Session Data:", req.session);
    console.log("🔍 User in Session:", req.user);
    res.json({ session: req.session, user: req.user });
});

// ✅ Update Username
router.put("/update-username", requireAuth, async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ message: "Username cannot be empty." });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { username },
            { new: true, select: "username avatar email" } // Return updated user
        );

        res.json({ message: "Username updated successfully!", user });
    } catch (err) {
        res.status(500).json({ message: "Error updating username.", error: err.message });
    }
});

module.exports = router;
