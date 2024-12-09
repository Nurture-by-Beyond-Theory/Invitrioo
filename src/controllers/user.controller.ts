// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const asyncHandler = require("express-async-handler");
import crypto from "crypto";
const {
	storeOtpInRedis,
	getOtpFromRedis,
	deleteOtpFromRedis,
} = require("../utils/redisHelper");
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
		const token = jwt.sign(
			{ email },
			process.env.JWT_SECRET as string,
			{ expiresIn: "1h" }
		);
		res.status(201).json({ user, token });
	}
);
export const verifyEmail = asyncHandler(
	async (req: Request, res: Response) => {}
);

export const login = asyncHandler( async (
	req: Request,
	res: Response,
): Promise<any> => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	// Step 2: Check if the user is using social auth
	if (
		!user.password &&
		user.authProvider !== "local"
	) {
		return res
			.status(400)
			.json({message: `Your account is linked to ${user.authProvider}. Please use that provider to log in or reset your password.`})
		};
	if (
		!user ||
		!(await bcrypt.compare(
			password,
			user.password
		))
	) {
		return res
			.status(401)
			.json({ error: "Invalid credentials" });
	}
	const token = jwt.sign(
		{ email },
		process.env.JWT_SECRET as string,
		{ expiresIn: "1h" }
	);
	return res
	.status(200)
	.json({message:"Login Successful", token });
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
		await storeOtpInRedis(email, otp, 600); // 600 seconds = 10 minutes

		// Send OTP via email
		await transporter.sendMail({
			from: "invitrioo@mail.com",
			to: email,
			subject: "Password Reset OTP",
			html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <p style="font-size: 16px;">Your OTP for resetting your password is:</p>
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
		const storedOtp = await getOtpFromRedis(
			email
		);
		if (!storedOtp) {
			return res.status(400).json({
				message:
					"No OTP request found or OTP expired",
			});
		}

		if (storedOtp !== otp) {
			return res
				.status(400)
				.json({ message: "Invalid OTP" });
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
		await deleteOtpFromRedis(email);

		return res
		.status(200)
		.json({
			message: "Password reset successful",
		});
	}
);