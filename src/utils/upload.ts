const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
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

export default uploadToCloudinary;