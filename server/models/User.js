const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    username: String,
    email: String,
    avatar: String,
    roles: { type: [String], default: ["player"] }, // 🔥 Add roles
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
