import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../../components/Header/Header";
import { Button, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Pagination from "@mui/material/Pagination";
const AllOrders = () => {
	const [orders, setOrders] = useState([]);
	const [totalPages, setTotalPages] = useState();
	const [page, setPage] = useState(1);

	const navigate = useNavigate();
	useEffect(() => {
		const jwtToken = Cookies.get("jwt");
		axios
			.get(`${import.meta.env.VITE_API_URL}/my-orders`, {
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},

				withCredentials: true,
			})
			.then((response) => {
				setOrders(response.data.orders);

				setTotalPages(response.data.pageInfo.totalPages);
			})
			.catch((error) => console.error("Error fetching orders:", error));
	}, []);

	const getOrders = async (pageNo) => {
		const jwtToken = Cookies.get("jwt");
		axios
			.get(`${import.meta.env.VITE_API_URL}/my-orders?pageNo=${pageNo}`, {
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},

				withCredentials: true,
			})
			.then((response) => {
				setOrders(response.data.orders);

				setTotalPages(response.data.pageInfo.totalPages);
			})
			.catch((error) => console.error("Error fetching orders:", error));
	};

	useEffect(() => {
		getOrders(page);
	}, [page]);

	const editOrder = (orderId) => {
		return navigate("/edit-order", { state: { orderId: orderId } });
	};

	const deleteOrder = (orderId) => {
		const authToken = Cookies.get("jwt");

		axios
			.delete(`${import.meta.env.VITE_API_URL}/delete-order/${orderId}`, {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			})
			.then((response) => {
				console.log("Order deleted successfully", response);
				setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
				alert("Order Deleted!");
			})
			.catch((error) => {
				console.error("Error deleting order", error);
			});
	};

	const handlePageChange = (event, newPageNumber) => {
		setPage(newPageNumber);
	};

	return (
		<div className="screen">
			<Header />
			<div className="all-orders">
				<h1>All Orders</h1>
				{orders.map((order) => (
					<div key={order._id} className="order-card">
						<div className="order-card-heading">
							<h3>Order ID: {order._id}</h3>
							<h4>Total Price: ${order.totalPrice.toFixed(2)}</h4>
						</div>
						<div>
							{order.items.map((item) => (
								<div key={item._id} className="book-info">
									<h4>{item.bookId.title}</h4>
									<p>Quantity: {item.quantity}</p>
									<p>Price: ${item.bookId.price}</p>
								</div>
							))}
						</div>
						<div className="order-edit-btn">
							<Button variant="contained" onClick={() => deleteOrder(order._id)} startIcon={<DeleteIcon />}>
								Delete
							</Button>
							<Button variant="contained" onClick={() => editOrder(order._id)} endIcon={<EditIcon />}>
								Edit
							</Button>
						</div>
					</div>
				))}
				<div className="page-navigation">
					<Pagination count={totalPages} color="primary" onChange={handlePageChange} page={page} />
				</div>
			</div>
		</div>
	);
};

export default AllOrders;
