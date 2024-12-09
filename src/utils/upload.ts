// const cloudinary = require("cloudinary").v2;
// const streamifier = require("streamifier");

// const uploadDoc = async (file) => {
// 	// Cloudinary configuration
// 	cloudinary.config({
// 		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// 		api_key: process.env.CLOUDINARY_API_KEY,
// 		api_secret: process.env.CLOUDINARY_API_SECRET,
// 	});

// 	  const stream =
// 			cloudinary.uploader.upload_stream(
// 				{ folder: "uploads" },
// 				(error, result) => {
// 					if (error)
// 					throw new Error({error:error.message})

// 					return({
// message:
// 							"File uploaded successfully!",
// 						file: {
// 							url: result.secure_url,
// 							public_id: result.public_id,
// 						},
// 					})
						
// 					});
// 				}
// 			);

// 		streamifier
// 			.createReadStream(req.file.buffer)
// 			.pipe(stream);
// 	return cloudinaryUpload.secure_url;
// };
// export default uploadDoc