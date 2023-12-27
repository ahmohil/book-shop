const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	items: [
		{
			bookId: {
				type: Schema.Types.ObjectId,
				ref: "Book",
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
		},
	],
	totalPrice: {
		type: Number,
		required: true,
	},
});

orderSchema.methods.getTotalPrice = async function () {
	await this.populate("items.bookId").execPopulate();

	const totalPrice = this.items.reduce((acc, items) => {
		const bookPrice = items.bookId.price;
		const quantity = items.quantity;
		return acc + bookPrice * quantity;
	}, 0);
	this.totalPrice = totalPrice;
	await this.save();
	return totalPrice;
};

module.exports = mongoose.model("Order", orderSchema);
