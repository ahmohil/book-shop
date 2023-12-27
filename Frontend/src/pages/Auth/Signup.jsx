import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import DropDown from "../../components/DropDown";
import Stack from "@mui/material/Stack";
import { TextField, Button } from "@mui/material";

const Signup = () => {
	const navigate = useNavigate();

	const role = ["buyer", "seller"];

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState({
		value: "",
		isTouched: false,
	});
	const [showOtp, setShowOtp] = useState(false);
	const [otp, setOtp] = useState("");

	const [selectedRole, setSelectedRole] = useState("buyer");
	const [errorMsg, setErrorMsg] = useState("");

	const optSelected = (opt) => {
		setSelectedRole(opt);
	};
	const clearForm = () => {
		setName("");
		setEmail("");
		setPassword("");
		setConfirmPassword({
			value: "",
			isTouched: false,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrorMsg("");

		axios
			.post("http://localhost:3000/signup", {
				name: name,
				email: email,
				password: password,
				role: selectedRole,
			})
			.then((res) => {
				navigate("/signup-otp", { state: { email: email } });
				clearForm();
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
						<p>Enter your Personal details to use all of site features</p>
						<button className="hidden" id="login" onClick={() => navigate("/login")}>
							Sign In
						</button>
					</div>
				</div>
			</div>
			<div className="form-container sign-up">
				<form onSubmit={handleSubmit}>
					<h1>Create Account</h1>
					{/*
					<div className="social-icons">{Social media Icons here }</div>
					<span>or use your email to registration</span>
					*/}
					<div className="error">{errorMsg}</div>
					{password !== confirmPassword.value && confirmPassword.isTouched ? (
						<p className="error">Password does not match.</p>
					) : null}
					<Stack width={"100%"}>
						<TextField
							type="text"
							name="name"
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							label="Enter Name"
							variant="outlined"
							className="input"
						/>
						<TextField
							type="email"
							name="name"
							id="name"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							label="Enter Email"
							variant="outlined"
							className="input"
						/>
						<TextField
							type="password"
							name="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							min={6}
							required
							label="Enter Pasword"
							variant="outlined"
							className="input"
						/>
						<TextField
							type="password"
							name="confirmPassword"
							id="confirmPassword"
							value={confirmPassword.value}
							onChange={(e) =>
								setConfirmPassword({
									...confirmPassword,
									value: e.target.value,
								})
							}
							onBlur={(e) =>
								setConfirmPassword({
									...confirmPassword,
									isTouched: true,
								})
							}
							min={6}
							required
							label="Confirm Pasword"
							variant="outlined"
							className="input"
						/>
						<DropDown options={role} selectedOption={optSelected} />
					</Stack>

					<button type="submit" disabled={password !== confirmPassword.value ? true : false}>
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
};

export default Signup;
