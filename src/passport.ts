// src/passportConfig.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "./models/user.model"; // Import your User model
import { generateToken } from "./utils/jwtHelper";
dotenv.config()
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env
				.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env
				.GOOGLE_CLIENT_SECRET as string,
			callbackURL:
				"http://localhost:3000/auth/google/callback",
		},
		async (
			accessToken,
			refreshToken,
			profile,
			done
		) => {
			try {
				// Access the email
				const email = profile.emails?.[0]?.value;
				// Check if user exists in the database
				   let user = await User.findOne({
							googleId: profile.id,
						});
   if (!user) {
			user = await User.create({
				googleId: profile.id,
				email,
				firstname: profile.name?.givenName,
				lastname: profile.name?.familyName,
				authProvider: "google",
			});
		}

		const token = generateToken(
			user.email,
			user.googleId
		);
		return done(null, { user, token });
			} catch (error) {
				return done(error, null);
			}
		}
	)
);

// Serialize and deserialize user information into the session
passport.serializeUser((user: any, done) => {
	done(null, user.user._id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});

export default passport;
