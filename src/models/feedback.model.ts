import mongoose, {
	Schema,
	Document,
} from "mongoose";

export interface FeedbackDocument
	extends Document {
	email: string;
	createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		match: [
			/\S+@\S+\.\S+/,
			"Please provide a valid email address",
		], // Email validation
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Feedback = mongoose.model<FeedbackDocument>(
	"Feedback",
	FeedbackSchema
);
export default Feedback;
