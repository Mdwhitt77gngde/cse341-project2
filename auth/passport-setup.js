// auth/passport-setup.js
// Robust passport setup: only register GitHub strategy if env vars are present.
// Safe to require at app startup even if OAuth env vars are missing.

require('dotenv').config(); // ensure env is loaded for local dev
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const callbackURL = process.env.GITHUB_CALLBACK_URL;

if (!clientID || !clientSecret || !callbackURL) {
  console.warn('WARNING: GitHub OAuth not configured. Skipping GitHub strategy registration.');
  console.warn('Set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_CALLBACK_URL in .env (or Render) to enable OAuth.');
  module.exports = passport;
} else {
  passport.use(new GitHubStrategy({
    clientID,
    clientSecret,
    callbackURL
  }, (accessToken, refreshToken, profile, done) => {
    // Minimal: forward profile to the callback route
    return done(null, profile);
  }));

  // No sessions (we use JWT) — nothing to serialize/deserialize here
  console.log('GitHub OAuth strategy registered.');
  module.exports = passport;
}
