// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import Feedback from "../models/feedback.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const asyncHandler = require("express-async-handler");
import { AuthRequest } from "../utils/authMiddleware";

import crypto from "crypto";
const {
	storeOtp,
	verifyOtp

} = require("../utils/otp");
import transporter from "../utils/nodemailer";

export const register = asyncHandler(
	async (
		req: Request,
		res: Response,
	) => {
		const {
			firstname,
			lastname,
			email,
			password,
		} = req.body;
		const hashedPassword = await bcrypt.hash(
			password,
			10
		);
		const user = await User.create({
			firstname,
			lastname,
			email,
			password: hashedPassword,
		});

		sendEmail(email, "Verify Email")
		// const token = jwt.sign(
		// 	{ email },
		// 	process.env.JWT_SECRET as string,
		// 	{ expiresIn: "1h" }
		// );
		res.status(201).json({ email: user.email, message:"Check Email for Verification"});
	}
);

export const sendEmail = asyncHandler(
	async (email:string, subject:string ) => {
		// Generate OTP and store it in Redis with 10-minute expiration
		const otp = crypto
			.randomInt(10000, 99999)
			.toString();
		await storeOtp(email, otp); // 600 seconds = 10 minutes

		// Send OTP via email
		await transporter.sendMail({
			from: "invitrioo@mail.com",
			to: email,
			subject: subject,
			html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <p style="font-size: 16px;">Your OTP to ${subject} is:</p>
            <p style="font-size: 22px; font-weight: bold; color: #FF5733;">${otp}</p>
            <p style="font-size: 14px; color: #555;">
                This OTP is valid for <span style="font-weight: bold;">10 minutes</span>. Please do not share it with anyone.
            </p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <footer style="font-size: 12px; color: #888;">
                <p>Thank you for using Invitrioo!</p>
                <p>If you didn’t request this, please ignore this email.</p>
            </footer>
        </div>
    `,
		});
	}
);

export const verifyEmail = asyncHandler(

	async (req: AuthRequest,
		res: Response,) => {
			// const email = req.user?.email
			const {otp, email} = req.body
			const user = await User.findOne({ email });
			if (!user) {
				return res
					.status(404)
					.json({ message: "User not found" });
			}
			const storedOtp = await verifyOtp(
			email,
			otp
		);
		if (!storedOtp) {
			return res.status(400).json({
				message:
					"Invalid OTP",
			});
		}
 user.isVerified = true;
 await user.save();
const token = jwt.sign(
	{ email },
	process.env.JWT_SECRET as string,
	{ expiresIn: "1h" }
);
 res
		.status(200)
		.json({
			message: "Account verified successfully.",
			user,
			token
		});
		
	}
);

export const sendFeedback = asyncHandler(
	async (req: Request, res: Response) => {
		const { email } = req.body;

		if (!email) {
			return res
				.status(400)
				.json({ message: "Email is required" });
		}

		// try {
			// Create and save the feedback email
			const feedback = new Feedback({ email });
			await feedback.save();

			res.status(201).json({
				message:
					"Feedback email saved successfully",
				feedback: {
					email: feedback.email,
					createdAt: feedback.createdAt,
				},
			});
		// } catch (error: any) {
		// 	if (error.code === 11000) {
		// 		// Duplicate email error
		// 		return res
		// 			.status(400)
		// 			.json({
		// 				message: "Email already exists",
		// 			});
		// 	}
		// 	res
		// 		.status(500)
		// 		.json({
		// 			message: "An error occurred",
		// 			error: error.message,
		// 		});
		// }
	}
);

export const login = asyncHandler( async (
	req: Request,
	res: Response,
): Promise<any> => {
	
	const { email, password } = req.body;
	
	const user = await User.findOne({
		email,
	}).populate("events");

	if (
		!user ||
		!(await bcrypt.compare(
			password,
			user.password
		))
	) {
		return res.status(401).json({
			error: "Invalid email or password",
		});
	}
	// Step 2: Check if the user is using social auth
	if (
		!user.password &&
		user.authProvider !== "local"
	) {
		return res
			.status(400)
			.json({
				message: `Your account is linked to ${user.authProvider}. Please use that provider to log in or reset your password.`,
			});
	}
	
	// Check if user is verified
	if (!user.isVerified) {
		sendEmail(email, "Verify Email");
		return res
			.status(403)
			.json({
				message:
					"Account not verified. Please verify your account to log in.",
			});
	}
	const token = jwt.sign(
		{ email },
		process.env.JWT_SECRET as string,
		{ expiresIn: "1h" }
	);
	return res
		.status(200)
		.json({
			message: "Login Successful",
			token,
			user,
		});
});

export const resetPasswordRequest = asyncHandler(
	async (req: Request, res: Response) => {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ message: "User not found" });
		}
		// Step 2: Check if the user is using social auth
		if (
			!user.password &&
			user.authProvider !== "local"
		) {
			return res
				.status(400)
				.json({
					message: `Your account is linked to ${user.authProvider}. Please use that provider to log in or reset your password.`,
				});
		}
		// Generate OTP and store it in Redis with 10-minute expiration
		const otp = crypto
			.randomInt(10000, 99999)
			.toString();
		await storeOtp(email, otp); // 600 seconds = 10 minutes

		// Send OTP via email
		sendEmail(email, "Reset Password");
		// await transporter.sendMail({
		// 	from: "invitrioo@mail.com",
		// 	to: email,
		// 	subject: "Password Reset OTP",
		// 	html: `
    //     <div style="font-family: Arial, sans-serif; color: #333;">
    //         <p style="font-size: 16px;">Your OTP for resetting your password is:</p>
    //         <p style="font-size: 22px; font-weight: bold; color: #FF5733;">${otp}</p>
    //         <p style="font-size: 14px; color: #555;">
    //             This OTP is valid for <span style="font-weight: bold;">10 minutes</span>. Please do not share it with anyone.
    //         </p>
    //         <hr style="border: 1px solid #eee; margin: 20px 0;">
    //         <footer style="font-size: 12px; color: #888;">
    //             <p>Thank you for using Invitrioo!</p>
    //             <p>If you didn’t request this, please ignore this email.</p>
    //         </footer>
    //     </div>
    // `,
		// });
		
		return res
			.status(200)
			.json({
				message: "OTP sent to your email",
			});
	}
);

export const verifyOTP = asyncHandler(
	async (req: Request, res: Response) => {
		const { email, otp } = req.body;
		// Get OTP from Redis
		const storedOtp = await verifyOtp(
			email,
			otp
		);
		if (!storedOtp) {
			return res.status(400).json({
				message:
					"No OTP request found or OTP expired",
			});
		}
		return res
		.status(200)
		.json({
			message:
				"OTP verified, you can now reset your password",
		});
	}
);

export const resetPassword = asyncHandler(
	async (req: Request, res: Response) => {
		const { email, newPassword } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ message: "User not found" });
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(
			newPassword,
			10
		);
		user.password = hashedPassword;
		await user.save();

		// Delete OTP from Redis
		// await deleteOtpFromRedis(email);

		return res
		.status(200)
		.json({
			message: "Password reset successful",
		});
	}
);

export const updatePassword = asyncHandler(
	async (
		req: AuthRequest,
		res: Response
	): Promise<any> => {
		const { currentPassword, newPassword } =
			req.body;
		const email = req.user.email;
		const user = await User.findOne({ email });
		// Validate input
		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				error:
					"Both current and new passwords are required.",
			});
		}
		// Step 2: Check if the user is using social auth
		if (
			!user.password &&
			user.authProvider !== "local"
		) {
			return res.status(400).json({
				message: `Your account is linked to ${user.authProvider}. Please use that provider to log in or reset your password.`,
			});
		}
		if (
			!(await bcrypt.compare(
				currentPassword,
				user.password
			))
		) {
			return res.status(401).json({
				error: "Current Password Incorrect",
			});
		}
		const hashedPassword = await bcrypt.hash(
			newPassword,
			10
		);
		// Update the user's password
		user.password = hashedPassword;
		await user.save();
		res.status(200).json({
			message: "Password updated successfully.",
		});
	}
);

export const updateProfile = asyncHandler(
	async (req: AuthRequest, res: Response) => {
const updates = req.body;
		if(req.file){
	const { path, originalname } = req.file;
		updates.profilePicture = path;
		}
		
		console.log(updates)
		const email = req.user?.email; // Assuming `req.user` contains authenticated user's info
		// const {
		// 	firstName,
		// 	lastName,
		// 	phoneNumber,
		// 	country,
		// 	state,
		// } = req.body;
		
			// Fetch the user from the database
			const user = await User.findOne({email});
	
			 const updatedUser =
					await User.findByIdAndUpdate(
						user._id,
						{ $set: updates },
						{ new: true, runValidators: true } // Return the updated document and validate fields
					);
					
			res.status(200).json({
				message: "Profile updated successfully.",
				user: updatedUser
			});
		
	}
);
export const updateRole = asyncHandler(
	async (req:Request, res:Response)=>{
		const {email,role} = req.body
		const user = await User.findOneAndUpdate({email}, {role})
	}
)