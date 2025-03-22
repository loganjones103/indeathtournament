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

// ✅ CORS - clean and correct
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

// ✅ Ensure CORS headers are set for every response
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ✅ Handle preflight requests
app.options("*", cors({
    origin: "http://localhost:3000",
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
        secure: false,
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
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
