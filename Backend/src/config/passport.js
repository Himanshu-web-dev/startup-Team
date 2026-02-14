const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');
const FounderProfile = require('../models/FounderProfile');
const MemberProfile = require('../models/MemberProfile');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ 
        $or: [
          { providerId: profile.id, authProvider: 'google' },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        // Update user info if needed
        if (!user.providerId) {
          user.providerId = profile.id;
          user.authProvider = 'google';
        }
        user.emailVerified = true; // Google emails are verified
        user.lastLogin = Date.now();
        await user.save();
        
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        authProvider: 'google',
        providerId: profile.id,
        emailVerified: true,
        role: 'member', // Default role for OAuth signups
        lastLogin: Date.now()
      });

      // Create member profile by default
      await MemberProfile.create({ userId: user._id });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
}

// LinkedIn OAuth Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL,
    scope: ['r_emailaddress', 'r_liteprofile']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ 
        $or: [
          { providerId: profile.id, authProvider: 'linkedin' },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        // Update user info if needed
        if (!user.providerId) {
          user.providerId = profile.id;
          user.authProvider = 'linkedin';
        }
        user.emailVerified = true;
        user.lastLogin = Date.now();
        await user.save();
        
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        authProvider: 'linkedin',
        providerId: profile.id,
        emailVerified: true,
        role: 'member', // Default role
        lastLogin: Date.now()
      });

      // Create member profile
      await MemberProfile.create({ userId: user._id });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
}

module.exports = passport;
