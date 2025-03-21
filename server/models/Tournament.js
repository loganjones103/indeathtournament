const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        enum: ["high-score", "speed-run", "survival"],
        required: true,
    },
    rules: {
        type: String,
    },
    participants: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            username: { type: String },
            score: { type: Number, default: 0 },
            proof: { type: String },
            submittedAt: { type: Date, default: Date.now }
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model("Tournament", TournamentSchema);
