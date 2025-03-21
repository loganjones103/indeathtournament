require("dotenv").config({ path: "./server/.env" }); // ✅ Explicitly load .env

const mongoose = require("mongoose");
const User = require("../models/User");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not defined in .env");
    process.exit(1); // Stop execution if no DB connection string
}

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log("✅ Connected to MongoDB");

    const result = await User.updateMany(
        { role: { $exists: true } },
        { $set: { roles: ["player"] } } // ✅ Convert single role to an array
    );

    console.log(`✅ Updated ${result.modifiedCount} users.`);
    mongoose.disconnect();
}).catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
});
