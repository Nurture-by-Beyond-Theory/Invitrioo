import { Router } from "express";
import {
	createEvent,
	getEvents,
	sendInvitation,
	generateQrCode,
	rsvpEvent,
	editEvent,
	shareEvent,
	getPublicEvent,
	getEvent,
	getCalendar,
	// sendEVentInvite,
} from "../controllers/event.controller";
import {upload} from "../utils/multer";
import { authMiddleware } from "../utils/authMiddleware";
const router = Router()

router.post(
	"/events",
  authMiddleware,
	upload.single("file"),
	createEvent
);

router.get(
	"/events",
	authMiddleware,
	getEvents
);
router.put(
	"/events/:id",
	authMiddleware,
	upload.single("file"),
	editEvent
);
router.get(
	"/events/:id/my-event",
	authMiddleware,
	getEvent
);
router.get("/events/:id", getPublicEvent);

router.get('/events/:id/share',
	shareEvent
)

router.post("/events/:id/", sendInvitation);
router.post("/events/:id/rsvp", rsvpEvent);

router.get("/calendar", authMiddleware, getCalendar);

router.post("/invitations/send", authMiddleware, sendInvitation);


// Generate QR Code
router.get('/events/:id/generate-qr', generateQrCode);
export default router;
