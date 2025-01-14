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
	facebookId: string;
	authProvider?: "google" | "local" | "facebook"; // To differentiate between social and traditional login
	isVerified: boolean;
	phoneNumber:  string ;
	country: string ;
	state: string ;
	profilePicture: string ;
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
		password: { type: String},
		googleId: {
			type: String,
			unique: true, // Unique constraint
			sparse: true, // Allows multiple `null` values
		},
		facebookId: {
			type: String,
			unique: true, // Unique constraint
			sparse: true, // Allows multiple `null` values
		},
		authProvider: {
			type: String,
			enum: ["google", "local", "facebook"],
			required: true,
			default: "local",
		},

		isVerified: {
			type: Boolean,
			default: false,
		},
		phoneNumber: { type: String },
    country: { type: String },
    state: { type: String },
    profilePicture: { type: String },
	});
UserSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.__v;

	return userObject;
};
export default mongoose.model<UserDocument>(
	"User",
	UserSchema
);
