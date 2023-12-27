import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Header from "../../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button } from "@mui/material";
import "./Home.css";
const BookShopHome = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState({});
	const [isLoggedIn, setIsLoggedIn] = useState("");
	const [books, setBooks] = useState([]);
	const [bookCounts, setBookCounts] = useState({});

	const handlePlusClick = (bookId) => {
		console.log(bookCounts);
		setBookCounts((prevCounts) => ({
			...prevCounts,
			[bookId]: (prevCounts[bookId] || 0) + 1,
		}));
	};

	const handleMinusClick = (bookId) => {
		console.log(bookCounts);
		setBookCounts((prevCounts) => ({
			...prevCounts,
			[bookId]: Math.max((prevCounts[bookId] || 0) - 1, 0),
		}));
	};

	useEffect(() => {
		let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
		if (!isLoggedIn) {
			navigate("/login");
		}

		setIsLoggedIn(isLoggedIn);
		console.log(localStorage.getItem("user"));
		let user = JSON.parse(localStorage.getItem("user"));
		setUser(user);

		axios
			.get(`${import.meta.env.VITE_API_URL}/get-books`)
			.then((res) => {
				setBooks(res.data.books);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	return (
		<div className="screen">
			<Header />
			<div className="home">
				<div className="home-heading">
					<h2>All the new books</h2>
				</div>
				<div className="cart">
					{bookCounts && (
						<Button
							variant="outlined"
							onClick={() => navigate("/create-order", { state: { books: bookCounts } })}
							endIcon={<ShoppingCartIcon />}>
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
									<Button onClick={() => handleMinusClick(book._id)} variant="outlined">
										<FontAwesomeIcon icon={faMinus} />
									</Button>

									<Button onClick={() => handlePlusClick(book._id)} variant="outlined">
										<FontAwesomeIcon icon={faPlus} />
									</Button>
									{/* <FontAwesomeIcon icon={faMinus} onClick={() => handleMinusClick(book._id)} /> */}
									{/* <FontAwesomeIcon icon={faPlus} onClick={() => handlePlusClick(book._id)} /> */}
								</div>
							</div>
							<h4>{book.title}</h4>
							<p>
								<h4>Author:</h4> {book.author}
							</p>
							<p>
								<h4>Price: </h4>${book.price.toFixed(2)}
							</p>
							<p>
								<h4>Description:</h4> {book.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default BookShopHome;
