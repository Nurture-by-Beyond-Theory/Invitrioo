import { Router } from "express";
import {
	register,
	login,
} from "../controllers/user.controller";
import passport from "../passport";
const asyncHandler = require("express-async-handler");
import User from "../models/user.model";

const router = Router();

router.post("/signup", register);

router.post("/login", login);

router.get("/err", (req,res,err)=>{
  console.log(err)
  res.send("Login Error")
})

// Initiates Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// // Google callback route
// router.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/auth/err',
//     // successRedirect: '/dashboard', // Redirect to a secure page after successful login
//   }),
//    (req, res) => {
//     // Check if the user has completed their profile setup
//   res.send("Welcome")  
//   }
// );

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
     res.redirect("/login/failed");
	})
);

// router.get(
// 	"/login/success",
// 	asyncHandler(async (req, res) => {
// 		if (req.user) {
// 				return res.status(200).json({
// 					status: true,
// 					message: "Login Successful",
// 					token: generateToken(user?.googleId, email);
// 					// username: findUser?.firstname +" "+ findUser?.lastname,
// 					// user_image: findUser?.user_image,
// 					// auth: "google"
// 				})
// 		} else {
// 			throw new Error("Something when wrong!");
// 		}
// 	})
// );

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
