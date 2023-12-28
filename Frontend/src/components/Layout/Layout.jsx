import React from "react";
import Header from "../Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Layout = ({ children }) => {
	return (
		<div className="screen">
			<Header />
			{children}
			<ToastContainer />
		</div>
	);
};

export default Layout;
