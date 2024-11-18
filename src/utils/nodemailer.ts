import nodemailer from "nodemailer";
// Nodemailer setup
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER, // Your email
		pass: process.env.EMAIL_PASS, // Your email password
	},
});

export default transporter