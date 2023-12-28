import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import Cookies from "js-cookie";

const EditOrder = () => {
	const [order, setOrder] = useState(null);
	const [bookQuantities, setBookQuantities] = useState({});
	const [bookTitles, setBookTitles] = useState({});
	const [bookPrices, setBookPrices] = useState({});
	const [totalBill, setTotalBill] = useState(null);
	const [billCalculated, setBillCalculated] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const fetchData = async () => {
			const jwtToken = Cookies.get("jwt");
			const { orderId } = location.state || {};
			try {
				const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-order/${orderId}`, {
					headers: {
						Authorization: `Bearer ${jwtToken}`,
					},
				});
				const orderData = response.data;

				setOrder(orderData.order);

				orderData.order.items.forEach((item) => {
					const { bookId, quantity } = item;
					bookQuantities[bookId] = quantity;
				});

				setBookQuantities(bookQuantities);

				const titlesFetched = Promise.all(
					Object.keys(bookQuantities).map(async (key) => {
						try {
							const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-book/${key}`, {
								headers: {
									Authorization: `Bearer ${jwtToken}`,
								},
							});
							const data = response.data;
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
				console.error("Error fetching order data:", error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		let bill = 0;
		console.log("Inside 2nd use Effect");
		if (billCalculated) {
			console.log(totalBill);
			Object.keys(bookQuantities).forEach((bookId) => {
				const bookCount = bookQuantities[bookId];
				const bookPrice = bookPrices[bookId];
				bill += bookCount * bookPrice;
			});
			setTotalBill(bill);
		}
	}, [bookQuantities, billCalculated]);

	const handlePlusClick = (bookId) => {
		setBookQuantities((prevQuantities) => ({
			...prevQuantities,
			[bookId]: (prevQuantities[bookId] || 0) + 1,
		}));
	};

	const handleMinusClick = (bookId) => {
		setBookQuantities((prevQuantities) => ({
			...prevQuantities,
			[bookId]: Math.max((prevQuantities[bookId] || 0) - 1, 0),
		}));
	};

	const updateOrder = async () => {
		const jwtToken = Cookies.get("jwt");

		const orderItems = Object.keys(bookQuantities).map((bookId) => ({
			bookId,
			quantity: bookQuantities[bookId],
		}));

		const requestBody = {
			items: orderItems,
		};

		try {
			const response = await axios.put(`${import.meta.env.VITE_API_URL}/edit-order/${order._id}`, requestBody, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwtToken}`,
				},
			});

			if (response.data.message === "Order updated") {
				return navigate("/order-summary", {
					state: { orderS: response.data.order, bookTitles: bookTitles, bookPrices: bookPrices },
				});
			}
		} catch (error) {
			console.error("Error updating order:", error);
		}
	};

	return (
		<div className="screen">
			<div className="order-page">
				<h1>Edit Order</h1>
				{order && (
					<>
						{/* Display order details, book quantities, and prices */}
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
										<td>{bookQuantities[bookId]}</td>
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
						</table>
						{billCalculated && (
							<div className="totalBill">
								<h2>{`Your updated payable amount is $${totalBill && totalBill.toFixed(2)}`}</h2>
								<Button variant="contained" onClick={updateOrder}>
									Update Order
								</Button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default EditOrder;
