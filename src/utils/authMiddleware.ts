import {
	Request,
	Response,
	NextFunction,
} from "express";
import jwt from "jsonwebtoken";

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
		req.user = { email: (decoded as any).email };
		next();
	} catch (error) {
		res.status(401).json({
			message: "Unauthorized: Invalid token",
		});
	}
};
