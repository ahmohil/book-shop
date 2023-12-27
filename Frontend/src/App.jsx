import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import SignUpOtp from "./pages/Auth/SignUpOtp";
import Order from "./pages/Buyer/Order";
import CreateBook from "./pages/Seller/CreateBook";
import CreateOrder from "./pages/Buyer/CreateOrder";
import OrderSummary from "./pages/Buyer/OrderSummary";
import AllOrders from "./pages/Buyer/AllOrders";
import EditOrder from "./pages/Buyer/EditOrder";
import SellerBooks from "./pages/Seller/SellerBooks";
import EditBook from "./pages/Seller/EditBook";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/home" element={<Home />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/signup-otp" element={<SignUpOtp />} />
				<Route path="/create-book" element={<CreateBook />} />
				<Route path="/order" element={<Order />} />
				<Route path="/create-order" element={<CreateOrder />} />
				<Route path="/order-summary" element={<OrderSummary />} />
				<Route path="/my-orders" element={<AllOrders />} />
				<Route path="/edit-order" element={<EditOrder />} />
				<Route path="/my-books" element={<SellerBooks />} />
				<Route path="/edit-book" element={<EditBook />} />
				<Route path="/*" element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
