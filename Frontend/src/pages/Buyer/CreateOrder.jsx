import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Button from "@mui/material/Button";
import "./buyer.css";
import axios from "axios";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthProvider";
const CreateOrder = ({}) => {
	const [bookCounts, setBookCounts] = useState({});
	const [bookTitles, setBookTitles] = useState({});
	const [bookPrices, setBookPrices] = useState({});
	const [totalBill, setTotalBill] = useState(null);
	const [billCalculated, setBillCalculated] = useState(false);
	const { user } = useAuth();

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const fetchData = () => {
			const jwtToken = Cookies.get("jwt");
			const { books } = location.state || {};
			setBookCounts(books);
			setBillCalculated(false);
			try {
				const titlesFetched = Promise.all(
					Object.keys(books).map(async (key) => {
						try {
							const response = await fetch(`${import.meta.env.VITE_API_URL}/get-book/${key}`, {
								headers: {
									Authorization: `Bearer ${jwtToken}`,
								},
							});
							const data = await response.json();
							const bookTitle = data.book.title;
							const bookPrice = data.book.price;
							setBookTitles((prevTitles) => ({
								...prevTitles,
								[key]: bookTitle,
							}));
							setBookPrices((prevPrices) => ({
								...prevPrices,
								[key]: bookPrice,
							}));
						} catch (error) {
							console.error(`Error fetching book title for bookId ${key}:`, error);
						}
					})
				);

				titlesFetched.then(() => {
					setBillCalculated(true);
				});
			} catch (error) {
				console.error("Error fetching book data:", error);
			}
		};

		fetchData();
	}, [user]);

	useEffect(() => {
		let bill = 0;
		if (billCalculated) {
			console.log(totalBill);
			Object.keys(bookCounts).forEach((bookId) => {
				const bookCount = bookCounts[bookId];
				const bookPrice = bookPrices[bookId];
				bill += bookCount * bookPrice;
			});
			setTotalBill(bill);
		}
	}, [bookCounts, billCalculated]);

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

	const createOrder = async () => {
		const jwtToken = Cookies.get("jwt");
		console.log(jwtToken);
		const orderItems = Object.keys(bookCounts).map((bookId) => ({
			bookId,
			quantity: bookCounts[bookId],
		}));

		const requestBody = {
			items: orderItems,
		};

		console.log(JSON.stringify(requestBody));
		try {
			const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-order/`, requestBody, {
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			});

			if (response.data.message == "Order created") {
				toast.success("Your order has been created");
				return navigate("/order-summary", {
					state: { orderS: response.data.order, bookTitles: bookTitles, bookPrices: bookPrices },
				});
			}
		} catch (error) {
			console.error("Error creating order:", error);
			toast.error("Something went wrong");
		}
	};

	return (
		<div className="screen">
			<div className="order-page">
				<table className="order-table">
					<thead>
						<tr>
							<th>Book Title</th>
							<th>Number of Books</th>
							<th>Price</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(bookTitles).map(([bookId, title]) => (
							<tr key={bookId}>
								<td>{title}</td>
								<td>{bookCounts[bookId]}</td>
								<td>{bookPrices[bookId]}</td>
								<td className="order-actions">
									<Button onClick={() => handleMinusClick(bookId)} variant="outlined">
										<FontAwesomeIcon icon={faMinus} />
									</Button>

									<Button onClick={() => handlePlusClick(bookId)} variant="outlined">
										<FontAwesomeIcon icon={faPlus} />
									</Button>
								</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<td colSpan={3}>{totalBill && <h2>{`Your total payable amount is $${totalBill.toFixed(2)}`}</h2>}</td>
							<td>
								<Button variant="contained" onClick={createOrder} disabled={!totalBill}>
									Place Order
								</Button>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
};

export default CreateOrder;
