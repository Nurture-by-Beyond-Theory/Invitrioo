import {
	Request,
	Response,
	NextFunction,
} from "express";
import Event from "../models/event.model";
const asyncHandler = require("express-async-handler");
// import uploadDoc from "../utils/upload";
import { AuthRequest } from "../utils/authMiddleware";
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const createEvent = asyncHandler(
  async(req: AuthRequest, res : Response)=>{
		// Helper function to handle Cloudinary upload
		const uploadToCloudinary = (
			fileBuffer: Buffer
		) => {
			return new Promise((resolve, reject) => {
				const uploadStream =
					cloudinary.uploader.upload_stream(
						{ folder: "uploads" },
						(error, result) => {
							if (error) return reject(error);
							resolve(result.secure_url);
						}
					);
				streamifier
					.createReadStream(fileBuffer)
					.pipe(uploadStream);
			});
		};

		const imageUrl = await uploadToCloudinary(
			req.file.buffer
		);
	

		// 
				const {
					title,
					description,
					organizer,
					date,
					time,
					location,
					capacity,
					isVirtual,
					// image,
					attendees,
				} = req.body;
		// console.log(req.user)
				if (!req.user?.email) {
					res.status(401).json({
						message:
							"Unauthorized: Email not found in token",
					});
					return;
				}

				// Create the event
				const newEvent = new Event({
					title,
					description,
					organizer: {
						// name: organizer.name,
						email: req.user?.email, // Use authenticated user's email
					},
					date,
					time,
					location,
					capacity: capacity || 0,
					isVirtual: isVirtual || false,
					image: {url: imageUrl},
					attendees: attendees || [],
				});

				// Save the event to the database
				const savedEvent = await newEvent.save();

				res
					.status(201)
					.json({
						message: "Event created successfully",
						event: savedEvent,
					});
	}
)
