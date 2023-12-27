const Book = require("../models/book");
const Order = require("../models/order");
const jwt = require("jsonwebtoken");

exports.createOrder = async (req, res, next) => {
	if (!req.body.items) {
		return res.status(400).json({ message: "Bad request" });
	}

	const user = req.user;

	const items = req.body.items;
	let populatedItems;
	try {
		populatedItems = await Promise.all(
			items.map(async (item) => {
				const book = await Book.findById(item.bookId);
				if (!book) {
					throw new Error("Book not found");
				}
				return {
					bookId: book._id,
					quantity: item.quantity,
					price: book.price,
				};
			})
		);
	} catch (error) {
		return res.status(404).json({ message: "Book not found" });
	}

	console.log(items);
	console.log(populatedItems);

	const total = populatedItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

	const order = new Order({
		items: items,
		userId: user.userId,
		totalPrice: total,
	});

	try {
		const result = await order.save();
		return res.status(201).json({
			message: "Order created",
			order: result,
		});
	} catch (error) {
		return res.status(500).json(error);
	}
};

// exports.getOrders = async (req, res, next) => {
// 	const user = req.user;

// 	const orders = await Order.find({ userId: user.userId });
// 	await Order.populate(orders, { path: "items.bookId", model: "Book" });

// 	res.status(200).json({
// 		message: "Orders fetched",
// 		orders: orders,
// 	});
// };

exports.getOrders = async (req, res, next) => {
	const user = req.user;
	const pageNo = parseInt(req.query.pageNo) || 1;
	const pageSize = 8;
	try {
		const totalOrders = await Order.countDocuments({ userId: user.userId });
		const totalPages = Math.ceil(totalOrders / pageSize);

		if (pageNo < 1 || pageNo > totalPages) {
			return res.status(400).json({ message: "Invalid page number" });
		}

		const skip = (pageNo - 1) * pageSize;

		const orders = await Order.find({ userId: user.userId })
			.skip(skip)
			.limit(pageSize)
			.populate({ path: "items.bookId", model: "Book" });

		res.status(200).json({
			message: "Orders fetched",
			orders: orders,
			pageInfo: {
				currentPage: pageNo,
				totalPages: totalPages,
				pageSize: pageSize,
				totalOrders: totalOrders,
			},
		});
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

exports.getOrderById = async (req, res, next) => {
	if (!req.params.orderId) {
		return res.status(400).json({ message: "Bad request" });
	}
	const orderId = req.params.orderId;
	const user = req.user;

	const order = await Order.findById(orderId);
	if (!order) {
		return res.status(404).json({ message: "Order not found" });
	}
	if (order.userId.toString() !== user.userId) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	res.status(200).json({
		message: "Order fetched",
		order: order,
	});
};

exports.editOrder = async (req, res, next) => {
	if (!req.params.orderId || !req.body.items) {
		return res.status(400).json({ message: "Bad request" });
	}

	const user = req.user;
	const orderId = req.params.orderId;
	const items = req.body.items;
	let populatedItems;
	try {
		populatedItems = await Promise.all(
			items.map(async (item) => {
				const book = await Book.findById(item.bookId);
				if (!book) {
					throw new Error("Book not found");
				}
				return {
					bookId: book._id,
					quantity: item.quantity,
					price: book.price,
				};
			})
		);
	} catch (error) {
		return res.status(404).json({ message: "Book not found" });
	}

	const total = populatedItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

	const order = await Order.findById(orderId);
	if (!order) {
		return res.status(404).json({ message: "Order not found" });
	}
	if (order.userId.toString() !== user.userId) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	order.items = items;
	order.totalPrice = total;

	try {
		const result = await order.save();
		return res.status(200).json({
			message: "Order updated",
			order: result,
		});
	} catch (error) {
		return res.status(500).json(error);
	}
};

exports.deleteOrder = async (req, res, next) => {
	if (!req.params.orderId) {
		return res.status(400).json({ message: "Bad request" });
	}

	const user = req.user;

	const orderId = req.params.orderId;
	const order = await Order.findById(orderId);
	if (!order) {
		return res.status(404).json({ message: "Order not found" });
	}
	if (order.userId.toString() !== user.userId) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		await Order.deleteOne({ _id: orderId });
		return res.status(200).json({ message: "Order deleted" });
	} catch (error) {
		return res.status(500).json(error);
	}
};
