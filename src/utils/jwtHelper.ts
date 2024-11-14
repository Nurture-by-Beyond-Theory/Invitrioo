import jwt from "jsonwebtoken";

export const generateToken = (
	email: string,
	googleId: string
) => {
	const payload = { email, googleId };
	const secret = process.env.JWT_SECRET as string; // Define JWT_SECRET in your .env file
	return jwt.sign(payload, secret, {
		expiresIn: "1h",
	});
};
