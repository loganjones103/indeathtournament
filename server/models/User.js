const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    username: String,
    email: String,
    avatar: String,
    role: { type: String, enum: ["player", "admin"], default: "player" }, // 🔥 Add roles
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
