import {
	Request,
	Response,
	NextFunction,
} from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export interface AuthRequest extends Request {
	user?: { email: string };
	file?: any
}

export const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): void => {
	const token =
		req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"
	if (!token) {
		res.status(401).json({
			message: "Unauthorized: Token not provided",
		});
		return;
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as { email: string };
		  // const user = await User.findById(
			// 	decoded.id
			// );

			// if (!user) {
			// 	return res
			// 		.status(404)
			// 		.json({ message: "User not found." });
			// }

			// if (!user.isVerified) {
			// 	return res
			// 		.status(403)
			// 		.json({
			// 			message:
			// 				"Account not verified. Access denied.",
			// 		});
			// }
		req.user = { email: (decoded as any).email };
		next();
	} catch (error) {
		res.status(401).json({
			message: "Unauthorized: Invalid token",
		});
	}
};


// export const checkVerification = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		const userId = req.user?.id; // Assuming user ID is stored in `req.user` from authentication middleware

// 		if (!userId) {
// 			return res
// 				.status(401)
// 				.json({ message: "Unauthorized" });
// 		}

// 		const user = await User.findById(userId);
// 		if (!user) {
// 			return res
// 				.status(404)
// 				.json({ message: "User not found" });
// 		}

// 		if (!user.isVerified) {
// 			return res
// 				.status(403)
// 				.json({
// 					message:
// 						"Access denied. Please verify your account first.",
// 				});
// 		}

// 		next(); // User is verified, proceed to the next middleware/handler
// 	} catch (error) {
// 		res
// 			.status(500)
// 			.json({
// 				message: "Internal Server Error",
// 				error,
// 			});
// 	}
// };