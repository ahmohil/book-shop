import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UndoDelete from "../../components/Undo/UndoDelete";

import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router";

const SellerBooks = () => {
	const [sellerBooks, setSellerBooks] = useState([]);
	const [open, setOpen] = useState(false);
	const [totalPages, setTotalPages] = useState();
	const [page, setPage] = useState(1);

	const canDeleteRef = useRef(false);

	const navigate = useNavigate();

	useEffect(() => {
		getBooks(page);
	}, []);

	const handleUndo = () => {
		setOpen(false);
		canDeleteRef.current = false;
	};

	const getBooks = async (pageNo) => {
		const jwtToken = Cookies.get("jwt");
		axios
			.get(`${import.meta.env.VITE_API_URL}/get-seller-books/?pageNo=${pageNo}`, {
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			})
			.then((response) => {
				setSellerBooks(response.data.books);
				setTotalPages(response.data.pageInfo.totalPages);
			})
			.catch((error) => console.error("Error fetching books:", error));
	};

	useEffect(() => {
		getBooks(page);
	}, [page]);

	const handlePageChange = (event, newPageNumber) => {
		setPage(newPageNumber);
	};

	const deleteBook = (bookId) => {
		setOpen(true);
		canDeleteRef.current = true;

		setTimeout(() => {
			if (canDeleteRef.current) {
				axios
					.delete(`${import.meta.env.VITE_API_URL}/delete-book/${bookId}`, {
						headers: {
							Authorization: `Bearer ${Cookies.get("jwt")}`,
						},
					})
					.then((response) => {
						setSellerBooks((prevSellerBooks) => prevSellerBooks.filter((book) => book._id !== bookId));
					})
					.catch((error) => {
						console.error("Error deleting Book", error);
					});
			}
		}, 3200);
	};

	const editBook = (bookId) => {
		navigate("/edit-book", { state: { bookId: bookId } });
	};
	return (
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
							<p>Access: {book.access.charAt(0).toUpperCase() + book.access.slice(1)}</p>
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
			<div className="page-navigation">
				<Pagination count={totalPages} color="primary" onChange={handlePageChange} page={page} />
			</div>
			<UndoDelete message="Book deleted" onUndo={handleUndo} open={open} setOpen={setOpen} />
		</div>
	);
};

export default SellerBooks;
