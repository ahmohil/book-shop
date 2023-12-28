import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import "./Header.css";

const Header = (props) => {
	const [role, setRole] = useState("");
	const navigate = useNavigate();
	const { user, logout, isLoggedIn } = useAuth();

	useEffect(() => {
		if (user) {
			console.log(user.role);
			setRole(user.role);
		}
	}, [user]);

	const handleShowBooks = () => {
		return navigate("/my-books");
	};

	const handleLogout = () => {
		logout();
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
		isLoggedIn && (
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
		)
	);
};

export default Header;
