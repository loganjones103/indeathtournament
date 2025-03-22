const express = require("express");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const userRoutes = require("./routes/userRoutes");

require("dotenv").config();

require("./models/User");
require("./auth");

const authRoutes = require("./routes/authRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");

const app = express();

// ✅ Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const allowedOrigins = [
    "http://localhost:3000",
    "https://in-death-tournament.vercel.app", // Vercel default domain
    "https://IDUTournament.com",             // Custom domain (adjust if needed)
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.options("*", cors({
    origin: allowedOrigins,
    credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Sessions (before passport)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    }
}));

// ✅ Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Debugging (optional)
app.use((req, res, next) => {
    console.log("🔍 Session Data:", req.session);
    console.log("🔍 User Data:", req.user);
    next();
});

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("In Death Tournament Backend Running!");
});

// ✅ Connect DB
mongoose.connect(process.env.MONGO_URI);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
