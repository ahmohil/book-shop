const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const bookSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	sellerId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	access: {
		type: String,
		enum: ["public", "private"],
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	uploadedOn: {
		type: Date,
		required: true,
	},
});

bookSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Book", bookSchema);
