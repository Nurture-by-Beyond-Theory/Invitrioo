import {
	Request,
	Response,
	NextFunction,
} from "express";
import Event from "../models/event.model";
import RSVP from "../models/rsvp.model";
import User from "../models/user.model";

const asyncHandler = require("express-async-handler");
import uploadToCloudinary from "../utils/upload";
import { AuthRequest } from "../utils/authMiddleware";
import { sendInvitationEmail } from "../utils/mailer";
import { generateQRCodeImage } from "../utils/qrcode";
import { ObjectId } from "mongodb";
const dotenv = require("dotenv");
dotenv.config();


export const createEvent = asyncHandler(
  async(req: AuthRequest, res : Response)=>{

 if (!req.file) {
		return res
			.status(400)
			.json({
				message: "Image file is required.",
			});
 }
		 const { path, originalname } = req.file;
		 const email = req.user?.email

				const {
					title,
					description,
					date,
					time,
					location,
					capacity,
					isVirtual,
					duration,
					attendees,
				} = req.body;
				if (!req.user?.email) {
					res.status(401).json({
						message:
							"Unauthorized: Email not found in token",
					});
					return;
				}
		const user = await User.findOne({email})

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
					duration,
					capacity: capacity || 0,
					isVirtual: isVirtual || false,
					image: {url: path, altText: originalname},
					attendees: attendees || [],
				});

				// Save the event to the database
				const savedEvent = await newEvent.save();
				const eventId =
					savedEvent._id as ObjectId;
				//Link to user
				user.events.push(eventId)
				await user.save()

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
		}).populate("rsvps");
 if (events.length === 0) {
		throw new Error("No events created")
 } 
		res.status(200).json({
			message: "success",
			event: events,
		});
	}
);

export const getEvent = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const email = req.user?.email;
		const { id } = req.params;
		const event = await Event.findOne({
			_id: id,
			"organizer.email": email,
		}).populate("rsvps");;
		if (!event) {
			return res
				.status(404)
				.json({ message: "Event not found" });
		}
		res.status(200).json({
			message: "success",
			event
		});
	}
);
export const getCalendar = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const email = req.user?.email;

				// Fetch all events associated with the logged-in user
				const events = await Event.find({
					email,
				}).select(
					"title description date"
				);

				res.status(200).json({
					success: true,
					events,
				});
	}
);

export const getPublicEvent = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const event = await Event.findOne({_id:id});
		 if (!event) {
				return res
					.status(404)
					.json({ message: "Event not found" });
			}
		res.status(200).json({
			message: "success",
			event: {
				id: event._id,
				title: event.title,
				description: event.description,
				date: event.date,
				location: event.location,
				time: event.time,
				picture: event.image,
				organiser: event.organizer['email']
			},
		});
	}
);

export const editEvent = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const { id } = req.params; // Event ID from the URL
		const updates = req.body; // Fields to update
		const userEmail = req.user?.email; // Logged-in user ID (added by authMiddleware)

		// Find the event by ID
		const event = await Event.findById(id);

		if (!event) {
			return res
				.status(404)
				.json({ message: "Event not found" });
		}

		// Ensure the logged-in user is the owner of the event
		if (event.organizer.email !== userEmail) {
			return res.status(403).json({
				message:
					"You are not authorized to edit this event",
			});
		}
		// Update only the fields provided in the request body
		Object.keys(updates).forEach((key) => {
			event.set(key, updates[key]);
		});

		// Save the updated event
		const updatedEvent = await event.save();

		res.status(200).json({
			message: "Event updated successfully",
			event: updatedEvent,
		});
	}
);

export const shareEvent = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		// const userEmail = req.user?.email; // Logged-in user ID (added by authMiddleware)
		// Find the event by ID
		const event = await Event.findById(id);
		if (!event) {
			return res
				.status(404)
				.json({ message: "Event not found" });
		}

		// Ensure the logged-in user is the owner of the event
		// if (event.organizer.email !== userEmail) {
		// 	return res.status(403).json({
		// 		message:
		// 			"You are not authorized to edit this event",
		// 	});
		// }
		// Generate the shareable link
		const shareableLink = `${process.env.BASE_URL}/events/${event._id}`;

		res.status(200).json({
			message:
				"Shareable link generated successfully",
			link: shareableLink,
			socialMediaLinks: {
				facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
					shareableLink
				)}`,
				twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
					shareableLink
				)}&text=${encodeURIComponent(
					`Check out this event: ${event.title}`
				)}`,
			},
		});
	}
);


// Send Invitation via Email, SMS, or Link
export const sendInvitation = asyncHandler( async (req: Request, res: Response) => {
  const { eventId, attendees, method } = req.body;
  
  try {
    for (const attendee of attendees) {
      if (method.includes('email')) {
        await sendInvitationEmail(attendee.email, eventId);
      }
      // if (method.includes('sms')) {
      //   await sendSMS(attendee.phone, eventId);
      // }
      // if (method.includes('link')) {
      //   const link = await generateLink(eventId, attendee);
      //   res.status(200).json({ status: 'success', link });
      // }
    }
    res.status(200).json({ status: 'success', message: 'Invitations sent successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export const generateQrCode = asyncHandler(
	async (req: Request, res: Response) => {
		// const { eventId, attendeeId } = req.body;
		const eventId = req.params.id
		try {
			const qrCode = await generateQRCodeImage(
				eventId,
				// attendeeId
			);
			res
				.status(200)
				.json({ status: "success", qrCode });
		} catch (error) {
			res
				.status(500)
				.json({
					status: "error",
					message: error.message,
				});
		}
	}
);

export const rsvpEvent = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, status } = req.body;
	const eventId = req.params.id

	// Check if the event exists
	const event = await Event.findById(eventId);
	if (!event) {
		return res
			.status(404)
			.json({ message: "Event not found" });
	}
	// Check if the user has already RSVP'd to the event
	const existingRSVP = await RSVP.findOne({
		event: eventId,
		email,
	});
	if (existingRSVP) {
		return res
			.status(400)
			.json({
				success: false,
				message:
					"You have already RSVP'd to this event",
			});
	}
	// Save the RSVP
	const rsvp = new RSVP({
		name,
		email,
		status,
		event: eventId,
	});
	await rsvp.save();
const rsvpId = rsvp._id as ObjectId;
	// Link the RSVP to the Event
	event.rsvps.push(rsvpId);
	await event.save();
	res
		.status(201)
		.json({
			message: "RSVP recorded successfully",
			rsvp,
		});
})