const express = require("express");
const passport = require("passport");
const User = require("../models/User"); // ✅ Import User model
const { requireAuth } = require("../middlewares/authMiddleware"); // ✅ Import requireAuth

const router = express.Router();

// ✅ Google OAuth Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// ✅ Google OAuth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("http://localhost:3000?loggedIn=true"); // ✅ Triggers re-fetch
    }
);

// ✅ Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => {
            res.redirect("http://localhost:3000/");
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
