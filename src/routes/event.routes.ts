import { Router } from "express";
import { createEvent, getEvents, sendInvitation, generateQrCode, rsvpEvent, editEvent, shareEvent, getPublicEvent, getCalendar } from "../controllers/event.controller";
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

router.get("/events/:id", getPublicEvent);
router.put(
	"/events/:id",
	authMiddleware,
	editEvent
);
router.get('/events/:id/share',
	// authMiddleware,
	shareEvent
)

router.get("/calendar", authMiddleware, getCalendar);

router.post("/invitations/send", authMiddleware, sendInvitation);
router.post("/events/:id", rsvpEvent);

// Generate QR Code
router.get('/events/:id/generate-qr', generateQrCode);
export default router;
