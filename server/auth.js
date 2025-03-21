const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const User = require("./models/User");
require("dotenv").config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            const baseUsername = profile.displayName || profile.emails[0].value.split("@")[0];
            let username = baseUsername;

            let count = 1;
            while (await User.findOne({ username })) {
                username = `${baseUsername}${count}`;
                count++;
            }

            // ✅ Download avatar image from Google
            const avatarUrl = profile.photos?.[0]?.value;
            let avatarFilename = "";

            if (avatarUrl) {
                const ext = path.extname(new URL(avatarUrl).pathname).split("?")[0] || ".jpg";
                avatarFilename = `${profile.id}_${Date.now()}${ext}`;
                const avatarPath = path.join(__dirname, "uploads", avatarFilename);

                const response = await axios.get(avatarUrl, { responseType: "stream" });
                const writer = fs.createWriteStream(avatarPath);
                response.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                });
            }

            // ✅ Create new user
            user = await User.create({
                googleId: profile.id,
                username,
                email: profile.emails[0].value,
                avatar: avatarFilename ? `/uploads/${avatarFilename}` : "",
                role: "player"
            });
        }

        done(null, user);
    } catch (err) {
        console.error("❌ Google Auth Error:", err);
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    console.log("🔹 Serializing User:", user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log("🔍 Finding User by ID:", id);
        const user = await User.findById(id).select("username email avatar role");
        if (!user) return done(null, false);
        console.log("✅ User Found:", user);
        done(null, user);
    } catch (err) {
        console.error("❌ Deserialization Error:", err);
        done(err, null);
    }
});
