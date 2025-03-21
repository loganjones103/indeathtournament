const express = require("express");
const Tournament = require("../models/Tournament");
const { requireAuth, requireAdmin } = require("../middlewares/authMiddleware");


const router = express.Router();

// ✅ Create a New Tournament (Admins Only)
router.post("/", requireAdmin, async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const existingTournament = await Tournament.findOne({ name: req.body.name });
        if (existingTournament) {
            return res.status(400).json({ message: "Tournament name already exists!" });
        }

        const tournament = new Tournament({
            ...req.body,
            createdBy: req.user._id
        });

        await tournament.save();
        res.status(201).json(tournament);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// ✅ Get All Tournaments (Anyone can access)
router.get("/", async (req, res) => {
    try {
        const tournaments = await Tournament.find().populate("createdBy", "username");
        res.json(tournaments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get Tournament by ID (Anyone can access)
router.get("/:id", async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id)
            .populate("participants.userId", "username") // Populate username from User model
            .populate("createdBy", "username"); // Also populate creator's username

        if (!tournament) return res.status(404).json({ message: "Tournament not found" });

        // ✅ Overwrite each participant's username with the one from populated user
        tournament.participants.forEach(p => {
            if (p.userId && p.userId.username) {
                p.username = p.userId.username;
            }
        });

        res.json(tournament);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ✅ Update Tournament (Only Admin or Creator)
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ message: "Tournament not found" });

        // ✅ Only allow tournament creator or admin to edit
        if (req.user.role !== "admin" && req.user._id.toString() !== tournament.createdBy.toString()) {
            return res.status(403).json({ message: "Access denied. Only admins or the tournament creator can edit." });
        }

        // ✅ Update tournament
        const updatedTournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTournament);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ✅ Delete Tournament (Admins Only)
router.delete("/:id", requireAdmin, async (req, res) => {
    try {
        const deletedTournament = await Tournament.findByIdAndDelete(req.params.id);
        if (!deletedTournament) return res.status(404).json({ message: "Tournament not found" });
        res.json({ message: "Tournament deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Player Joins Tournament
router.post("/:id/join", requireAuth, async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ message: "Tournament not found" });

        const alreadyJoined = tournament.participants.some(
            p => p.userId.toString() === req.user._id.toString()
        );
        if (alreadyJoined) {
            return res.status(400).json({ message: "You have already joined this tournament" });
        }

        tournament.participants.push({
            userId: req.user._id,
            username: req.user.username, // ✅ Store username
            score: 0,
            proof: ""
        });

        await tournament.save();

        res.json({ message: "Successfully joined tournament!", tournament });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Submit Score with Proof
router.post("/:id/submit-score", requireAuth, async (req, res) => {
    try {
        const { score, proof } = req.body;
        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ message: "Tournament not found" });

        // ✅ Find player in participants
        const player = tournament.participants.find(p => p.userId.toString() === req.user._id.toString());
        if (!player) return res.status(403).json({ message: "You are not in this tournament!" });

        // ✅ Update player score and proof
        player.score = score;
        player.proof = proof;
        await tournament.save();

        res.json({ message: "Score submitted successfully!", tournament });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
