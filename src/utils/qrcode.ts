import QRCode from "qrcode";

export const generateQRCodeImage = async (
	eventId: string,
	attendeeId: string
) => {
	const data =  `https://jobbertrack.onrender.com/api/checkin${eventId}/${attendeeId}`;
	return QRCode.toDataURL(data); // Generates a base64 QR code
};
