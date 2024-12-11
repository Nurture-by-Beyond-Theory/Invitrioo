import mongoose, {
	Schema,
	Document,
} from "mongoose";

interface IOtp extends Document {
	email: string;
	otp: string;
	createdAt: Date;
}

const OtpSchema = new Schema<IOtp>({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	otp: { type: String, required: true },
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 600,
	}, // TTL: 300 seconds
});

const Otp = mongoose.model<IOtp>(
	"Otp",
	OtpSchema
);
export default Otp;
