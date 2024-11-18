// src/passportConfig.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
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
passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret:
				process.env.FACEBOOK_APP_SECRET,
			callbackURL:
				"http://localhost:3000/auth/facebook/callback",
			profileFields: [
				"id",
				"displayName",
				"email",
				"photos",
			],
		},
		async (
			accessToken,
			refreshToken,
			profile,
			done
		) => {
			try {
				const [firstname, lastname] =
					profile.displayName.split(" ");
				// Check if user exists in the database
				let user = await User.findOne({
					facebookId: profile.id,
				});
				if (!user) {
					// If user doesn't exist, create a new user
					user = await User.create({
						facebookId: profile.id,
						firstname,
						lastname,
						email: profile.emails?.[0]?.value,
						// profilePicture:
						// 	profile.photos?.[0]?.value,
						authProvider: profile.provider
					});
				}

				const token = generateToken(
					user.email,
					user.facebookId
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
	let id:any;
	if(user.authProvider =="facebook"){
		id = user._id
	} else{
		id = user.user._id
	}
	done(null, id);
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
