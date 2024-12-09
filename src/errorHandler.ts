import {
	Request,
	Response,
	NextFunction,
} from "express";
import { Error as MongooseError } from "mongoose";

interface CustomError {
	msg: string;
	statusCode: number;
	error: string;
}

function errorHandler(
	err: any, 
	req: Request,
	res: Response,
	next: NextFunction
): void {
	let customError: CustomError = {
		msg:
			err.msg ||
			err.message ||
			"Something went wrong",
		statusCode: err.statusCode || 500,
		error: err || "Something went wrong!",
	};

	// Handle CastError
	if (err.name === "CastError") {
		customError.msg = "Not Found";
		customError.statusCode = 404;
	}

	// Handle ValidationError
	if (err.name === "ValidationError") {
		let errStatusCode: number | null = null;

		if (
			err.details &&
			err.details[0].type === "string.empty"
		) {
			errStatusCode = 400;
		}

		customError.msg = err.errors
			? Object.values(err.errors)
					.map((item: any) => item.message)
					.join(".   ")
			: err.details
					.map((item: any) => item.message)
					.join(".   ");
		customError.statusCode = errStatusCode
			? errStatusCode
			: 422;
		customError.statusCode === 422
			? (customError.error = "Validation Error")
			: true;
	}

	// Handle query or params validation errors
	if (
		err.type === "query" ||
		err.type === "params"
	) {
		customError.statusCode = 422;
		customError.msg =
			err.error.details[0].message;
		customError.error = "Validation Error";
	}

	// Handle MongoDB duplicate key error
	if (err.code === 11000) {
		customError.statusCode = 409;
		customError.msg = `${
			Object.keys(err.keyPattern)[0]
		} already exists!`;
		customError.error = "Conflict";
	}

	// Handle email sending error
	if (err.responseCode) {
		customError.statusCode = 500;
		customError.msg = "Unable to send e-mail!";
		customError.error = "Server error";
	}

	// Handle file upload error
	if (err.code === "ENOENT") {
		customError.msg =
			"Please contact the server administrator!";
	}

	// Handle MulterError (file upload limit exceeded)
	if (
		err.name === "MulterError" &&
		err.code === "LIMIT_FILE_COUNT"
	) {
		customError.msg =
			err.message || "Too many files";
		customError.statusCode = 422;
		customError.error = "Validation Error";
	}

	// Send response
	res.status(customError.statusCode).json({
		statusCode: customError.statusCode,
		message: customError.msg,
		error: customError.error,
	});
	next();
}

export { errorHandler };
