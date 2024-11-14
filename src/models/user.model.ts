// src/models/User.ts
import mongoose, {
	Schema,
	Document,
} from "mongoose";

interface UserDocument extends Document {
	email: string;
	password: string;
	firstname: string;
	lastname: string;
	googleId?: string; // To store Google-specific ID
	authProvider?: "google" | "local"; // To differentiate between social and traditional login
}

const UserSchema: Schema<UserDocument> =
	new Schema({
		firstname: {
			type: String,
			// required: true,
		},
		lastname: {
			type: String,
			// required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: { type: String },
		googleId: { type: String, unique: true },
		authProvider: {
			type: String,
			enum: ["google", "local"],
			required: true,
		},
	});

export default mongoose.model<UserDocument>(
	"User",
	UserSchema
);
