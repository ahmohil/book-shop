import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
const OrderSummary = ({}) => {
	const [order, setOrder] = useState("");
	const [titles, setTitles] = useState("");
	const [prices, setPrices] = useState("");
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const { orderS, bookTitles, bookPrices } = location.state || null;
		setOrder(orderS);
		setTitles(bookTitles);

		setPrices(bookPrices);
		console.log(order);
		console.log(orderS);
		console.log(bookTitles);
		console.log(titles);
	}, []);

	return (
		<div className="screen">
			<div className="order-page">
				<h2>Your Order has been placed</h2>
				<h2>Order Details</h2>
				{order && order.items && (
					<table>
						<thead>
							<tr>
								<th>Book Title</th>
								<th>Quantity</th>
								<th>Price</th>
							</tr>
						</thead>
						<tbody>
							{order.items.map((item) => (
								<tr key={item._id}>
									<td>{titles[item.bookId]}</td>
									<td>{item.quantity}</td>
									<td>$ {prices[item.bookId]}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td colSpan="2">
									<h2>Total Order Price:</h2>
								</td>
								<td>
									<h2>$ {order.totalPrice.toFixed(2)}</h2>
								</td>
							</tr>
						</tfoot>
					</table>
				)}
			</div>
		</div>
	);
};

export default OrderSummary;
