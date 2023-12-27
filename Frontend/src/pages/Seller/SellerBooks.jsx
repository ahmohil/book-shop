import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router";
const SellerBooks = () => {
	const [sellerBooks, setSellerBooks] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/get-seller-books/`, {
				headers: {
					Authorization: `Bearer ${Cookies.get("jwt")}`,
				},
			})
			.then((response) => {
				console.log("Books fetched successfully", response);
				setSellerBooks(response.data.books);
			})
			.catch((error) => {
				console.error("Error fetching books", error);
			});
	}, []);

	const deleteBook = (bookId) => {
		axios
			.delete(`${import.meta.env.VITE_API_URL}/delete-book/${bookId}`, {
				headers: {
					Authorization: `Bearer ${Cookies.get("jwt")}`,
				},
			})
			.then((response) => {
				alert("Book Deleted");
				setSellerBooks((prevSelllerBooks) => prevSelllerBooks.filter((book) => book._id !== bookId));
			})
			.catch((error) => {
				console.error("Error deleting Book", error);
			});
	};

	const editBook = (bookId) => {
		navigate("/edit-book", { state: { bookId: bookId } });
	};
	return (
		<div className="screen">
			<Header />
			<div className="seller-books-page">
				<h2>Seller Books</h2>
				<div className="padding"></div>
				{sellerBooks.length === 0 ? (
					<p>No books available.</p>
				) : (
					<div className="books-container">
						{sellerBooks.map((book) => (
							<div key={book._id} className="book-card">
								<h3>{book.title}</h3>
								<p>Author: {book.author}</p>
								<p>Description: {book.description}</p>
								<p>Price: ${book.price}</p>
								<p>Uploaded On: {new Date(book.uploadedOn).toLocaleString()}</p>
								<div className="order-edit-btn">
									<Button variant="contained" onClick={() => deleteBook(book._id)} startIcon={<DeleteIcon />}>
										Delete
									</Button>
									<Button variant="contained" onClick={() => editBook(book._id)} endIcon={<EditIcon />}>
										Edit
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default SellerBooks;
