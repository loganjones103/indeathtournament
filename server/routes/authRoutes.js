const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Google OAuth Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// ✅ CLIENT_URL for redirects
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ✅ Google OAuth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: true }),
    (req, res) => {
        console.log("✅ Google login successful. Redirecting to client.");
        res.redirect(`${CLIENT_URL}?loggedIn=true`);
    }
);

// ✅ Logout + Clear Cookie
router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) {
            console.error("Logout Error:", err);
            return res.status(500).json({ message: "Logout failed" });
        }

        req.session.destroy(() => {
            res.clearCookie("connect.sid", {
                path: "/",
                httpOnly: true,
                secure: true,         // Required for cross-origin
                sameSite: "None"      // Required for cross-origin
            });

            res.redirect(`${CLIENT_URL}/?loggedOut=true`);
        });
    });
});

// ✅ Get Logged-In User
router.get("/user", (req, res) => {
    console.log("🧠 Session:", req.session);
    console.log("👤 Authenticated User:", req.user);

    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    res.json(req.user);
});

// ✅ Debug Session (optional)
router.get("/debug-session", (req, res) => {
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
            { new: true, select: "username avatar email" }
        );

        res.json({ message: "Username updated successfully!", user });
    } catch (err) {
        res.status(500).json({ message: "Error updating username.", error: err.message });
    }
});

module.exports = router;
