const mongoose = require("mongoose");
const Tournament = require("./models/Tournament");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const tournamentData = {
    name: "Elite Death Tournament",
    description: "Score as high as you can!",
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-04-10"),
    type: "high-score",
    rules: "No mods allowed",
    createdBy: new mongoose.Types.ObjectId(), // Replace with actual user ID
};

Tournament.create(tournamentData)
    .then(tournament => {
        console.log("✅ Tournament Created:", tournament);
        mongoose.connection.close();
    })
    .catch(err => {
        console.error("❌ Error creating tournament:", err);
        mongoose.connection.close();
    });
