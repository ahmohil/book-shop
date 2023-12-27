import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { TextField, Button } from "@mui/material";
import "./auth.css";
const Login = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	const clearForm = () => {
		setEmail("");
		setPassword("");
	};

	useEffect(() => {
		let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
		if (isLoggedIn) {
			navigate("/Home");
		}
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		axios
			.post("http://localhost:3000/login", {
				email: email,
				password: password,
			})
			.then((res) => {
				console.log(res);
				console.log(res.data.isVerified == "true");
				if (!res.data.isVerified) {
					return navigate("/signup-otp", { state: { email: email } });
				}
				console.log(res.data.user);

				Cookies.set("jwt", res.data.token);
				const user = res.data.user;
				localStorage.setItem("user", JSON.stringify(user));
				localStorage.setItem("isLoggedIn", JSON.stringify(true));

				navigate("/home", {
					state: {
						name: res.data.user.name,
					},
				});
				clearForm();
			})
			.catch((err) => {
				console.log(err);
				setErrorMsg(err.response.data.message);
			});
	};
	return (
		<div className="container">
			<div className="form-container sign-in">
				<form onSubmit={handleSubmit}>
					<h1>Sign In</h1>
					{/*
					<div className="social-icons">{Social icons here}</div>
					<span>or use your email/password</span>
					 */}
					<div className="error">{errorMsg}</div>
					<TextField
						type="email"
						name="email"
						value={email}
						id="login-email"
						onChange={(e) => setEmail(e.target.value)}
						required
						label="Enter Email"
						variant="outlined"
						className="input"
					/>
					<TextField
						type="password"
						name="password"
						id="login-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						min={6}
						required
						label="Enter Pasword"
						variant="outlined"
						className="input"
					/>
					<Link to="/forgot-password">Forgot Password?</Link>
					<button type="submit">Sign In</button>
					<span className="signup-text">
						Don't have an account? <Link to="/signup">Sign Up</Link>
					</span>
				</form>
			</div>
			<div className="toggle-container">
				<div className="toggle">
					<div className="toggle-panel toggle-right">
						<h1>Welcome Back!</h1>
						<p>Register with your Personal details to use all of site features</p>
						<button className="hidden" id="register" onClick={() => navigate("/signup")}>
							Sign Up
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
