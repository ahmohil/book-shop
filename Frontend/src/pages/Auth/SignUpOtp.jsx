import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import DropDown from "../../components/DropDown";
import Stack from "@mui/material/Stack";
import { TextField, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const SignUpOtp = ({}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { email } = location.state || {};

	const [otp, setOtp] = useState("");

	const [errorMsg, setErrorMsg] = useState("");
	const clearForm = () => {
		setOtp("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		axios
			.post("http://localhost:3000/verify-otp?type=signup", {
				email: email,
				otp: otp,
			})
			.then((res) => {
				navigate("/login");
			})
			.catch((err) => {
				console.log(err);
				setErrorMsg(err.response.data.message);
			});
	};

	return (
		<div className="container active">
			<div className="toggle-container toggle-left">
				<div className="toggle">
					<div className="toggle-panel ">
						<h1>Welcome to e-Book Shop</h1>
						<br />
						<p>Enter OTP sent to your email to verify your account</p>
						<button className="hidden" id="login" onClick={() => navigate("/login")}>
							Sign In
						</button>
					</div>
				</div>
			</div>
			<div className="form-container sign-up">
				<form onSubmit={handleSubmit}>
					<h1>Enter OTP</h1>
					<div className="error">{errorMsg}</div>
					<TextField
						type="number"
						name="otp"
						id="otp"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						required
						label="Enter Otp"
						variant="outlined"
						className="input"
					/>

					<button type="submit">Verify OTP</button>
				</form>
			</div>
		</div>
	);
};

export default SignUpOtp;
