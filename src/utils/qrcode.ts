import QRCode from "qrcode";

export const generateQRCodeImage = async (
	eventId: string,
	// attendeeId: string
) => {
	const data = `https://jobbertrack.onrender.com/api/events/$67878c892bb81e0716310ceb`;
	// "localhost:3000/api/events/67878c892bb81e0716310ceb"
	
	return QRCode.toDataURL(data); // Generates a base64 QR code
};
