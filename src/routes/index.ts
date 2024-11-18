import { Router } from "express";
import {
	register,
	login,
} from "../controllers/user.controller";
import passport from "../passport";
const asyncHandler = require("express-async-handler");
// import User from "../models/user.model";

const router = Router();

router.post("/signup", register);

router.post("/login", login);

router.get("/err", (req,res,err)=>{
  console.log(err)
  res.send("Login Error")
})

// Initiates Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/auth/login/failed",
	}),
	asyncHandler(async (req, res) => {
		if (req.user) {
			const { user, token } = req.user as {
				user: any;
				token: string;
			};

			// Send back the user data and JWT token as a response
			return res.status(200).json({
				success: true,
				message: "Login successful",
				user: {
					email: user.email,
					firstname: user.firstname,
					lastname: user.lastname,
					// authProvider: user.authProvider,
				},
				token, // JWT token for further API access
			});
		}
	})
);

// router.get(
// 	"/login/success",
// 	asyncHandler(async (req, res) => {
// 		console.log(req)
// 	})
// );

// Route to start Facebook authentication
router.get(
	"/facebook",
	passport.authenticate("facebook", {
		scope: ["email"],
	})
);

// Facebook OAuth callback route
router.get(
	"/facebook/callback",
	passport.authenticate("facebook", {
		// successRedirect: '/dashboard', // Redirect here on success
		failureRedirect: "/auth/login/failed", // Redirect here on failure
	}),
	asyncHandler(async (req, res) => {
		if (req.user) {
			const { user, token } = req.user as {
				user: any;
				token: string;
			};

			// Send back the user data and JWT token as a response
			return res.status(200).json({
				success: true,
				message: "Login successful",
				user: {
					email: user.email,
					firstname: user.firstname,
					lastname: user.lastname,
					// authProvider: user.authProvider,
				},
				token, // JWT token for further API access
			});
		}
	})
);

router.get(
	"/login/failed",
	asyncHandler(async (req, res) => {
		res.status(401).json({
			status: false,
			message: "Login failed",
		});
	})
);

export default router;
