const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const uploadDir = path.join(__dirname, "uploads");
const {
	CloudinaryStorage,
} = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
dotenv.config();
// Check if the 'uploads' directory exists, if not, create it
// if (!fs.existsSync(uploadDir)) {
// 	fs.mkdirSync(uploadDir);
// }
// // Configure multer for file uploads
// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, "uploads/"); // Destination folder for uploaded files
// 	},
// 	filename: function (req, file, cb) {
// 		cb(
// 			null,
// 			Date.now() + "-" + file.originalname
// 		); // Filename with timestamp
// 	},
// });


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "uploads",
		allowed_formats: ["pdf", "jpg", "png"],
	},
});
// File type validation
function checkFileType(file, cb) {
	const filetypes = /pdf|jpg|jpeg|png/;
	const extname = filetypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = filetypes.test(file.mimetype);
	if (mimetype && extname) {
		return cb(null, true);
	} else {
		console.log("NO PDF")
		cb("Error: PDFs Only!");
	}
}
export const upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		 console.log("File received:", cb);
		checkFileType(file, cb);
	},
});

// module.exports = { upload };
