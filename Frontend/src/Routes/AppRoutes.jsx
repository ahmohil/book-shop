import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "../pages/Auth/Signup";
import Login from "../pages/Auth/Login";
import Home from "../pages/Home/Home";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import SignUpOtp from "../pages/Auth/SignUpOtp";
import Order from "../pages/Buyer/Order";
import CreateBook from "../pages/Seller/CreateBook";
import CreateOrder from "../pages/Buyer/CreateOrder";
import OrderSummary from "../pages/Buyer/OrderSummary";
import AllOrders from "../pages/Buyer/AllOrders";
import EditOrder from "../pages/Buyer/EditOrder";
import SellerBooks from "../pages/Seller/SellerBooks";
import EditBook from "../pages/Seller/EditBook";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/AuthProvider";

const AppRoutes = () => {
	const { user, isLoggedIn } = useAuth();
	return (
		<BrowserRouter>
			<Layout>
				<Routes>
					<Route path="/home" element={!isLoggedIn ? <Login /> : <Home />} />
					<Route path="/signup" element={!isLoggedIn ? <Signup /> : <Home />} />
					<Route path="/login" element={!isLoggedIn ? <Login /> : <Home />} />
					<Route path="/forgot-password" element={!isLoggedIn ? <ForgotPassword /> : <Home />} />
					<Route path="/signup-otp" element={<SignUpOtp />} />
					<Route path="/create-book" element={!isLoggedIn ? <Login /> : <CreateBook />} />
					<Route path="/order" element={!isLoggedIn ? <Login /> : <Order />} />
					<Route path="/create-order" element={!isLoggedIn ? <Login /> : <CreateOrder />} />
					<Route path="/order-summary" element={!isLoggedIn ? <Login /> : <OrderSummary />} />
					<Route path="/my-orders" element={!isLoggedIn ? <Login /> : <AllOrders />} />
					<Route path="/edit-order" element={!isLoggedIn ? <Login /> : <EditOrder />} />
					<Route path="/my-books" element={!isLoggedIn ? <Login /> : <SellerBooks />} />
					<Route path="/edit-book" element={!isLoggedIn ? <Login /> : <EditBook />} />
					<Route path="/*" element={!isLoggedIn ? <Login /> : <Home />} />
				</Routes>
			</Layout>
		</BrowserRouter>
	);
};

export default AppRoutes;
