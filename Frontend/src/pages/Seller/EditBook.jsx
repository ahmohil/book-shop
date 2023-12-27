import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography } from "@mui/material";
import Header from "../../components/Header";
import "./seller.css";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router";
const EditBook = () => {
	const [bookData, setBookData] = useState({
		title: "",
		author: "",
		description: "",
		price: "",
	});
	const [bookId, setBookId] = useState();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const { bookId } = location.state || {};
		setBookId(bookId);
		const jwtToken = Cookies.get("jwt");

		axios
			.get(`${import.meta.env.VITE_API_URL}/get-book/${bookId}`, {
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			})
			.then((response) => {
				const { title, author, description, price } = response.data.book;
				setBookData({ title, author, description, price });
			})
			.catch((error) => {
				console.error("Error fetching book data:", error);
			});
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setBookData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const jwtToken = Cookies.get("jwt");

		axios
			.put(`${import.meta.env.VITE_API_URL}/edit-book/${bookId}`, bookData, {
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			})
			.then((response) => {
				console.log("Book updated successfully", response);
				alert("Book has been updated");
			})
			.catch((error) => {
				console.error("Error updating book", error);
			});
	};

	return (
		<div className="screen">
			<Header />
			<div className="create-book-form">
				<Container maxWidth="sm">
					<Typography variant="h4" align="center" gutterBottom>
						Edit Book
					</Typography>
					<form onSubmit={handleSubmit}>
						<TextField
							label="Title"
							name="title"
							fullWidth
							value={bookData.title}
							onChange={handleChange}
							required
							margin="normal"
						/>
						<TextField
							label="Author"
							name="author"
							fullWidth
							value={bookData.author}
							onChange={handleChange}
							required
							margin="normal"
						/>
						<TextField
							label="Description"
							name="description"
							fullWidth
							multiline
							rows={4}
							value={bookData.description}
							onChange={handleChange}
							required
							margin="normal"
						/>
						<TextField
							label="Price"
							name="price"
							fullWidth
							type="number"
							value={bookData.price}
							onChange={handleChange}
							required
							margin="normal"
						/>
						<Button type="submit" variant="contained" color="primary" fullWidth>
							Update Book
						</Button>
					</form>
				</Container>
			</div>
		</div>
	);
};

export default EditBook;
