const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");
require("dotenv").config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback", // ✅ Use env variable
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        // ✅ Auto-generate a unique username if missing
        if (!user) {
            const baseUsername = profile.displayName || profile.emails[0].value.split("@")[0];
            let username = baseUsername;
            
            // Ensure username is unique
            let count = 1;
            while (await User.findOne({ username })) {
                username = `${baseUsername}${count}`;
                count++;
            }

            user = await User.create({
                googleId: profile.id,
                username,
                email: profile.emails[0].value,
                avatar: profile.photos?.[0]?.value || "", // Ensure avatar field exists
                role: "player"  // 🔥 Default role
            });
        }

        done(null, user);
    } catch (err) {
        console.error("❌ Google Auth Error:", err);
        done(err, null);
    }
}));

// ✅ Serialize user ID into the session
passport.serializeUser((user, done) => {
    console.log("🔹 Serializing User:", user.id);
    done(null, user.id);
});

// ✅ Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        console.log("🔍 Finding User by ID:", id);
        const user = await User.findById(id).select("username email avatar role"); // ✅ Only return necessary fields
        
        if (!user) {
            console.log("❌ User not found in DB");
            return done(null, false);
        }

        console.log("✅ User Found:", user);
        done(null, user);
    } catch (err) {
        console.error("❌ Deserialization Error:", err);
        done(err, null);
    }
});
