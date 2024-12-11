import {
	Request,
	Response,
	NextFunction,
} from "express";
import Event from "../models/event.model";
const asyncHandler = require("express-async-handler");
import uploadToCloudinary from "../utils/upload";
import { AuthRequest } from "../utils/authMiddleware";
const dotenv = require("dotenv");
dotenv.config();


export const createEvent = asyncHandler(
  async(req: AuthRequest, res : Response)=>{
		// Helper function to handle Cloudinary upload
		
		const imageUrl = await uploadToCloudinary(
			req.file.buffer
		);

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
				} = req.body.data;
		console.log(req.body.data)
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

export const getEvents = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const email= req.user?.email
		const events = await Event.find({
			"organizer.email": email,
		});
 if (events.length === 0) {
		throw new Error("No events created")
 } 
		res.status(200).json({
			message: "success",
			event: events,
		});
	}
);