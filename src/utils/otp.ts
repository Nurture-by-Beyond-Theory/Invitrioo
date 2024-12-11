import Otp from "../models/otp.model"


async function storeOtp(
	email: string,
	otp: string
): Promise<void> {
	await Otp.findOneAndUpdate(
		{ email },
		{ otp, createdAt: new Date() },
		{ upsert: true } // Create if not exists
	);
}

async function verifyOtp(
	email: string,
	inputOtp: string
): Promise<boolean> {
	const record = await Otp.findOne({ email });
	if (!record) return false; // Expired or not found
	const isValid = record.otp === inputOtp;
	if (isValid) await record.deleteOne(); // Clean up after verification
	return isValid;
}
module.exports = {
verifyOtp,
storeOtp
};