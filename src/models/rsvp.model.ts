import mongoose, {
	Schema,
	Document,
} from "mongoose";

interface RSVPDocument extends Document {
	name: string;
	email: string;
	status: boolean; // true for attending, false for not attending
	event: mongoose.Schema.Types.ObjectId; // Reference to Event
}

const RSVPSchema: Schema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, },
	status: { type: Boolean, required: true, default: false },
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Event",
		required: true,
		index: true,
	},
});

const RSVP = mongoose.model<RSVPDocument>(
	"RSVP",
	RSVPSchema
);
export default RSVP;
