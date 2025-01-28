import mongoose, {
	Schema,
	Document,
	// HookNextFunction,
} from "mongoose";
// import { HookNextFunction } from "mongoose";
// Define an interface for the event document
export interface IEvent extends Document {
	title: string;
	description: string;
	organizer: {
		// name: string;
		email: string;
	};
	date: Date;
	time: string;
	duration: string;
	location: string;
	// capacity: number;
	// isVirtual: boolean;
	image: {
		url: string;
		altText?: string;
	};
	user: mongoose.Schema.Types.ObjectId;
	rsvps: mongoose.Types.ObjectId[];
	status: "pending" | "completed";
	createdAt: Date;
	updatedAt: Date;
}

// Define the schema
const EventSchema: Schema = new Schema<IEvent>({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
	},
	organizer: {
		// name: {
		// 	type: String,
		// 	required: true,
		// },
		email: {
			type: String,
			required: true,
			match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		},
	},
	date: {
		type: Date,
		required: true,
	},
	time: {
		type: String, // E.g., 'HH:mm'
		required: true,
	},
	duration: {
		type: String, // E.
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	// capacity: {
	// 	type: Number,
	// 	default: 0,
	// },
	// isVirtual: {
	// 	type: Boolean,
	// 	default: false,
	// },
	image: {
		url: {
			type: String,
			required: true,
		},
		altText: {
			type: String,
			default: "",
		},
	},
	// attendees: [
	// 	{
	// 		name: {
	// 			type: String,
	// 			required: true,
	// 		},
	// 		email: {
	// 			type: String,
	// 			required: true,
	// 			match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	// 		},
	// 		rsvp: {
	// 			type: String,
	// 			enum: ["Yes", "No", "Maybe"],
	// 			default: "No",
	// 		},
	// 	},
	// ],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		index: true,
	},
	rsvps: [
		{ type: Schema.Types.ObjectId, ref: "RSVP" },
	],
	status: {
		type: String,
		enum: ["pending", "completed"],
		default: "pending",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Update the `updatedAt` field before saving
EventSchema.pre("save", function (next) {
	this.updatedAt = new Date();
	next();
});

// Pre middleware for find queries
EventSchema.pre(
	"find",
	async function (
		next: mongoose.CallbackWithoutResultAndOptionalError
	) {
		const now = new Date();

		// Dynamically update the status of events that are fetched
		await this.model
			.find({
				date: { $lt: now },
				status: { $ne: "completed" },
			})
			.updateMany({ status: "completed" });

		next();
	}
);

// Pre middleware for findOne queries
EventSchema.pre(
	"findOne",
	async function (
		next: mongoose.CallbackWithoutResultAndOptionalError
	) {
		const now = new Date();

		// Dynamically update the status of the single event being fetched
		await this.model.updateOne(
			{
				...this.getQuery(),
				date: { $lt: now },
				status: { $ne: "completed" },
			},
			{ $set: { status: "completed" } }
		);

		next();
	}
);

// EventSchema.pre("remove", async function (next) {
// 	const eventId = this._id;

// 	// Delete all RSVPs associated with this event
// 	await mongoose
// 		.model("RSVP")
// 		.deleteMany({ event: eventId });

// 	next();
// });

// Create and export the model
const Event = mongoose.model<IEvent>(
	"Event",
	EventSchema
);

export default Event;
