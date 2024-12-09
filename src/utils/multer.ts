const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadDir = path.join(__dirname, "uploads");

// Check if the 'uploads' directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}
// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/"); // Destination folder for uploaded files
	},
	filename: function (req, file, cb) {
		cb(
			null,
			Date.now() + "-" + file.originalname
		); // Filename with timestamp
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
