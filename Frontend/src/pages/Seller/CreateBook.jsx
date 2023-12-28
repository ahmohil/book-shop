import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography } from "@mui/material";
import "./seller.css";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
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

		if (!bookData.title || !bookData.author || !bookData.description || !bookData.price) {
			toast.error("All fields are mandatory.");
			return;
		}
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
				toast.success("Book created");
			})
			.catch((error) => {
				console.error("Error adding book", error);
				toast.error("Error Adding Book");
			});
	};

	return (
		<div className="screen">
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
							onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
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
