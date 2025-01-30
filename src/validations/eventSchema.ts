import moment from "moment";
import Joi from "joi";

// Validation Schema
export const eventSchema = Joi.object({
	title: Joi.string()
		.trim()
		.min(5)
		.max(100)
		.required()
		.messages({
			"string.empty": "Title is required.",
			// "string.min":
			// 	"Title must be at least 5 characters.",
			"string.max":
				"Title cannot exceed 100 characters.",
		}),

	description: Joi.string()
		.min(10)
		.max(1000)
		.required()
		.messages({
			"string.empty": "Description is required.",
			// "string.min":
			// 	"Description must be at least 10 characters.",
			"string.max":
				"Description cannot exceed 1000 characters.",
		}),

	date: Joi.string()
		.required()
		.custom((value, helpers) => {
			const eventDate = moment(
				value,
				"YYYY-MM-DD",
				true
			);
			if (!eventDate.isValid()) {
				return helpers.error("any.invalid");
			}
			if (
				eventDate.isBefore(
					moment().startOf("day")
				)
			) {
				return helpers.error("date.min");
			}
			return value;
		})
		.messages({
			"string.empty": "Event date is required.",
			"any.invalid":
				"Invalid date format. Use 'YYYY-MM-DD' (e.g., 2025-03-15).",
			"date.min":
				"Event date cannot be in the past.",
		}),

	time: Joi.string()
		.required()
		.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
		.messages({
			"string.empty": "Event time is required.",
			"string.pattern.base":
				"Invalid time format. Use HH:mm (24-hour format).",
		}),

	duration: Joi.string()
		.required()
		// .pattern(/^\d+[hm]$/)
		.messages({
			"string.empty":
				"Event duration is required.",
			// "string.pattern.base":
			// 	"Invalid duration format. Use '3h' or '45m'.",
		}),

	location: Joi.string()
		.trim()
		.min(3)
		.required()
		.messages({
			"string.empty":
				"Event location is required.",
			// "string.min":
			// 	"Location must be at least 3 characters.",
		}),
});
