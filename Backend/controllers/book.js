const Book = require("../models/book");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.addBook = async (req, res, next) => {
	if (!req.body.title || !req.body.author || !req.body.price || !req.body.description) {
		return res.status(400).json({ message: "Bad request" });
	}

	const user = req.user;

	let book;
	try {
		book = new Book({
			title: req.body.title,
			uploadedBy: user.userId,
			author: req.body.author,
			description: req.body.description,
			price: req.body.price,
			uploadedOn: new Date(),
		});
	} catch {
		return res.status(500).json({ message: "Internal server error" });
	}

	try {
		const result = await book.save();
		res.status(201).json({
			message: "Book created",
			result: result,
		});
	} catch (error) {
		return res.status(500).json(error);
	}
};

exports.getSellerBooks = async (req, res, next) => {
	const user = req.user;

	let books;
	try {
		books = await Book.find({ uploadedBy: user.userId });
		return res.status(200).json({
			message: "Books fetched",
			books: books,
		});
	} catch {
		return res.status(500).json({ message: "Internal server error" });
	}
};

exports.editBook = async (req, res, next) => {
	if (!req.headers.authorization || !req.body.title || !req.body.author || !req.body.price || !req.body.description) {
		return res.status(400).json({ message: "Bad request" });
	}

	const user = req.user;
	const bookId = req.params.bookId;

	const book = await Book.findById(bookId);
	if (!book) {
		return res.status(404).json({ message: "Book not found" });
	}
	if (book.uploadedBy.toString() !== user.userId) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	book.title = req.body.title;
	book.author = req.body.author;
	book.price = req.body.price;
	book.description = req.body.description;

	try {
		const result = await book.save();
		res.status(200).json({
			message: "Book updated",
			result: result,
		});
	} catch (error) {
		return res.status(500).json(error);
	}
};

exports.getBookById = async (req, res, next) => {
	if (!req.params.bookId) {
		return res.status(400).json({ message: "Bad request" });
	}
	const bookId = req.params.bookId;
	const book = await Book.findById(bookId);
	if (!book) {
		return res.status(404).json({ message: "Book not found" });
	}
	res.status(200).json({
		message: "Book fetched",
		book: book,
	});
};

exports.deleteBook = async (req, res, next) => {
	if (!req.params.bookId) {
		return res.status(400).json({ message: "Bad request" });
	}

	const user = req.user;

	Book.deleteOne({ _id: req.params.bookId, uploadedBy: user.userId })
		.then((result) => {
			console.log(result);
			if (result.deletedCount > 0) {
				res.status(200).json({ message: "Book deleted" });
			} else {
				res.status(401).json({ message: "You don't have the book you are trying to delete" });
			}
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// exports.getBooks = async (req, res, next) => {
// 	try {
// 		const books = await Book.find();
// 		return res.status(200).json({
// 			message: "Books fetched",
// 			books: books,
// 		});
// 	} catch {
// 		return res.status(500).json({ message: "Internal server error" });
// 	}
// };

exports.getBooks = async (req, res, next) => {
	try {
		const pageNumber = Number(req.query.page) || 1;
		const itemsPerPage = Number(req.query.itemsPerPage) || 10;

		const options = {
			page: pageNumber,
			limit: itemsPerPage,
		};

		const result = await Book.paginate({}, options);
		res.status(200).json({
			pageNumber: result.page,
			totalPages: result.totalPages,
			totalBooks: result.totalDocs,
			hasNextPage: result.hasNextPage,
			hasPrevPage: result.hasPrevPage,
			books: result.docs,
		});
	} catch {
		console.error(err);
		res.status(500).json({
			message: "Internal Server Error",
			error: err.message,
		});
	}
};
