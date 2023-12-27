require("dotenv").config();
const express = require("express");
const router = express.Router();
const BookController = require("../controllers/book");
const authorization = require("../middlewares/authorize");

router.post("/add-book", authorization.checkIfSeller, authorization.appendUser, BookController.addBook);
router.get("/get-seller-books", authorization.checkIfSeller, authorization.appendUser, BookController.getSellerBooks);
router.get("/get-book/:bookId", BookController.getBookById);
router.get("/get-books", BookController.getBooks);
router.put("/edit-book/:bookId", authorization.checkIfSeller, authorization.appendUser, BookController.editBook);
router.delete("/delete-book/:bookId", authorization.appendUser, authorization.checkIfSeller, BookController.deleteBook);

module.exports = router;
