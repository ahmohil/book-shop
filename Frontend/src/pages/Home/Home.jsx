import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button } from "@mui/material";
import "./Home.css";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "react-toastify";
import CartIcon from "../../components/Home/CartIcon";
import Pagination from "@mui/material/Pagination";

const BookShopHome = () => {
	const navigate = useNavigate();
	const [books, setBooks] = useState([]);
	const [bookCounts, setBookCounts] = useState({});
	const { user, isLoggedIn } = useAuth();
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState();

	const handlePlusClick = (bookId) => {
		if (user && user.role == "seller") {
			toast.error("You can only sell books");
			return;
		}
		console.log(bookCounts);
		setBookCounts((prevCounts) => ({
			...prevCounts,
			[bookId]: (prevCounts[bookId] || 0) + 1,
		}));

		console.log(Object.keys(bookCounts).length);
	};

	useEffect(() => {
		getBooks();
	}, []);
	useEffect(() => {
		getBooks();
	}, [page]);

	const getBooks = () => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/get-books/?pageNo=${page}`)
			.then((res) => {
				setBooks(res.data.books);
				console.log(res);
				setTotalPages(res.data.totalPages);
			})
			.catch((error) => {
				toast.error("Error fetching books");
			});
	};

	const handlePageChange = (event, newPageNumber) => {
		setPage(newPageNumber);
	};

	return (
		<div className="screen">
			<div className="home">
				<div className="home-heading">
					<h2>All the new books</h2>
				</div>
				<div className="cart">
					{bookCounts && (
						<Button
							variant="outlined"
							onClick={() => navigate("/create-order", { state: { books: bookCounts } })}
							startIcon={Object.keys(bookCounts).length > 0 && <CartIcon items={Object.keys(bookCounts).length} />}
							endIcon={<ShoppingCartIcon />}
							style={{ height: "40px" }}>
							View Cart
						</Button>
					)}
				</div>
				<div className="books-container">
					{books.map((book) => (
						<div className="book-card" key={book._id}>
							<div className="book-card-line-1">
								<h4>Book Title:</h4>
								<div className="book-card-icons">
									<Button onClick={() => handlePlusClick(book._id)} variant="outlined">
										Add to Cart
										<FontAwesomeIcon icon={faPlus} />
									</Button>
								</div>
							</div>
							<h4>{book.title}</h4>
							<span>
								<h4>Author:</h4> {book.author}
							</span>
							<span>
								<h4>Price: </h4>${book.price.toFixed(2)}
							</span>
							<span>
								<h4>Description:</h4> {book.description}
							</span>
						</div>
					))}
				</div>
				<div className="page-navigation">
					<Pagination count={totalPages} color="primary" onChange={handlePageChange} page={page} />
				</div>
			</div>
		</div>
	);
};

export default BookShopHome;
