const express = require("express");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
require("dotenv").config();

require("./models/User"); // Import User model
require("./auth"); // Import Passport config

const authRoutes = require("./routes/authRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true // ✅ Allows cookies to be sent
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ensure Sessions Are Set Up Before Passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // 🔥 Store sessions in MongoDB
    cookie: {
        secure: false,  // Set to `true` if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1-day session
    }
}));


// ✅ Initialize Passport Middleware After Session
app.use(passport.initialize());
app.use(passport.session());

// ✅ Debug Session Data
app.use((req, res, next) => {
    console.log("🔍 Session Data:", req.session);
    console.log("🔍 User Data:", req.user);
    next();
});

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);

app.get("/", (req, res) => {
    res.send("In Death Tournament Backend Running!");
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit process if connection fails
    });


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
