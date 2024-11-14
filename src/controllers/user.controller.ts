// src/controllers/userController.ts
import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (
	req: Request,
	res: Response
) => {
	try {
		const { firstname, lastname, email, password } =
			req.body;
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
		res.status(201).json({ user });
	} catch (error) {
		res
			.status(400)
			.json({ error: error.message });
	}
};

export const login = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
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
			{ id: user._id },
			process.env.JWT_SECRET as string,
			{ expiresIn: "1h" }
		);
		res.json({ token });
	} catch (error) {
		res
			.status(400)
			.json({ error: error.message });
	}
};
