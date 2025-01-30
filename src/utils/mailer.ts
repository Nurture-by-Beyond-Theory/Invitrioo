import transporter from "../utils/nodemailer";

export const invitationEmail = async (
	email: string,
	eventId: string,
	icsEvent: string,
	title: string,
) => {
	const mailOptions = {
		from: "invitrioo@gmail.com",
		to: email,
		subject: `You are invited to ${title}`,
		html: `<h2><a href = "https://jobbertrack.onrender.com/api/events/${eventId}">Click here for more details</a></h2>`,
		attachments: [
			{
				filename: "event.ics",
				content: icsEvent,
				contentType: "text/calendar",
			},
		],
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