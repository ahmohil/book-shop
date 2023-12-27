import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography } from "@mui/material";
import Header from "../../components/Header";
import "./seller.css";
import Cookies from "js-cookie";

const CreateBook = () => {
	const [bookData, setBookData] = useState({
		title: "",
		author: "",
		description: "",
		price: "",
	});

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
			.post(`${import.meta.env.VITE_API_URL}/add-book`, bookData, {
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			})
			.then((response) => {
				console.log("Book added successfully", response);
				setBookData({
					title: "",
					author: "",
					description: "",
					price: "",
				});
				alert("Book Created");
			})
			.catch((error) => {
				console.error("Error adding book", error);
			});
	};

	return (
		<div className="screen">
			<Header />
			<div className="create-book-form">
				<Container maxWidth="sm">
					<Typography variant="h4" align="center" gutterBottom>
						Create a New Book
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
							Create Book
						</Button>
					</form>
				</Container>
			</div>
		</div>
	);
};

export default CreateBook;
