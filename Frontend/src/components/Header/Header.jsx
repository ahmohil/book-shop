import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = (props) => {
	const [isLoggedIn, setIsLoggedIn] = useState(null);
	const [role, setRole] = useState("");
	const navigate = useNavigate();
	const [user, setUser] = useState("");

	useEffect(() => {
		let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
		if (!isLoggedIn) {
			navigate("/login");
		}

		setIsLoggedIn(isLoggedIn);
		console.log(localStorage.getItem("user"));
		let user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			setRole(user.role);
		}
		//console.log(user);
		setUser(user);
	}, []);

	const handleShowBooks = () => {
		return navigate("/my-books");
	};

	const handleLogout = () => {
		localStorage.removeItem("user");
		Cookies.remove("jwt");
		localStorage.setItem("isLoggedIn", JSON.stringify(false));
		setIsLoggedIn(false);
		navigate("/login");
	};

	const handleOrders = () => {
		navigate("/my-orders");
	};
	const handleCreateBook = () => {
		navigate("/create-book");
	};
	const handleHome = () => {
		navigate("/home");
	};
	return (
		<div className="header">
			{user && (
				<h3 onClick={handleHome} className="header-logo-text">
					{" "}
					Welcome {user.name}
				</h3>
			)}
			<div className="header-btns">
				{role == "seller" && (
					<button onClick={handleCreateBook} className="logout-button header-btn">
						CreateBook
					</button>
				)}
				{role == "seller" && (
					<button onClick={handleShowBooks} className="logout-button header-btn">
						My Books
					</button>
				)}
				{role == "buyer" && (
					<button onClick={handleOrders} className="logout-button header-btn">
						Your Order(s)
					</button>
				)}
				<button onClick={handleLogout} className="logout-button header-btn">
					Logout
				</button>
			</div>
		</div>
	);
};

export default Header;
