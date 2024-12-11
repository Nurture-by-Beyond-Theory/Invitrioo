import { Router } from "express";
import { createEvent, getEvents } from "../controllers/event.controller";
// import {upload} from "../utils/multer";
// const cloudinary = require("cloudinary").v2;
// const {
// 	CloudinaryStorage,
// } = require("multer-storage-cloudinary");
import { authMiddleware } from "../utils/authMiddleware";
const router = Router()
const multer = require("multer");

// const storage = new CloudinaryStorage({
// 	cloudinary: cloudinary,
// 	params: {
// 		folder: "uploads", // Replace with your desired folder name in Cloudinary
// 		format: async () => "png", // Optional: specify file format (e.g., png, jpg)
// 		public_id: (req, file) =>
// 			file.originalname.split(".")[0], // Use original file name
// 	},
// });
const upload = multer();
router.post(
	"/create-event",
  authMiddleware,
	upload.single("file"),
	createEvent
);

router.get(
	"/get-events",
	authMiddleware,
	getEvents
);

export default router;
