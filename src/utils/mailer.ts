import transporter from "../utils/nodemailer";

export const invitationEmail = async (
	email: string,
	eventId: string
) => {
	const mailOptions = {
		from: "invitrioo@gmail.com",
		to: email,
		subject: "Event Invitation",
		html: `<p>You are invited to the event.</p> <>View details at: <a href = "https://jobbertrack.onrender.com/api/events/${eventId}">Invitrioo</a>`,
	};

	return transporter.sendMail(mailOptions);
};


export const acceptanceEmail = async (
	email: string,
	eventId: string,
) => {
	const mailOptions = {
		from: "invitrioo@gmail.com",
		to: email,
		subject: "Event Invitation",
		html: `<p>You are registered to this event.</p> View details at:</p> <a href = "https://jobbertrack.onrender.com/api/events/${eventId}">Invitrioo</a>`,
	};

	return transporter.sendMail(mailOptions);
};