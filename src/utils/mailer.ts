import transporter from "../utils/nodemailer";

export const sendInvitationEmail = async (
	email: string,
	eventId: string
) => {
	const mailOptions = {
		from: "your-email@gmail.com",
		to: email,
		subject: "Event Invitation",
		text: `You are invited to the event. View details at: https://jobbertrack.onrender.com/api/${eventId}`,
	};

	return transporter.sendMail(mailOptions);
};
