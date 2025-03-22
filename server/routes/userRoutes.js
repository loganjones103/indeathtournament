const express = require("express");
const { requireAdmin } = require("../middlewares/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Get all users (admin only)
router.get("/", requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "username email roles");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update roles (admin only)
router.put("/:id/roles", requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { roles: req.body.roles },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
