import { Router } from "express";
import {
	register,
	login,
	resetPasswordRequest,
	verifyOTP,
	resetPassword,
	verifyEmail,
	updatePassword,
	updateProfile,
	updateRole,
	sendFeedback
} from "../controllers/user.controller";
import passport from "../passport";
import { authMiddleware } from "../utils/authMiddleware";
const asyncHandler = require("express-async-handler");
import { upload } from "../utils/multer";
const router = Router();

router.post("/signup", register);

router.post(
	"/verify-email",
	// authMiddleware,
	verifyEmail
);

router.post("/login", login);

// router.get("/err", (req,res,err)=>{
//   res.send("Login Error")
// })

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

// 1. Request Password Reset
router.post(
	"/reset-password/request",
	resetPasswordRequest
);

// 2. Verify OTP
router.post(
	"/reset-password/verify",
	verifyOTP
);

// 3. Reset Password
router.post(
	"/reset-password",
	resetPassword
);

router.put("/update-password",authMiddleware, updatePassword)

router.post("/feedback", sendFeedback)

router.put(
	"/profile",
	authMiddleware,
	upload.single("file"),
	updateProfile
);
router.put("/update-role", updateRole)


export default router;
