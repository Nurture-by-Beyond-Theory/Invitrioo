import mongoose, {
	Schema,
	Document,
} from "mongoose";

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
	location: string;
	capacity: number;
	isVirtual: boolean;
	image: {
		url: string;
		altText?: string;
	};
	attendees: {
		name: string;
		email: string;
		rsvp: "Yes" | "No" | "Maybe";
	}[];
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
	location: {
		type: String,
		required: true,
	},
	capacity: {
		type: Number,
		default: 0,
	},
	isVirtual: {
		type: Boolean,
		default: false,
	},
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
	attendees: [
		{
			name: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
				match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			},
			rsvp: {
				type: String,
				enum: ["Yes", "No", "Maybe"],
				default: "No",
			},
		},
	],
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

// Create and export the model
const Event = mongoose.model<IEvent>(
	"Event",
	EventSchema
);

export default Event;
