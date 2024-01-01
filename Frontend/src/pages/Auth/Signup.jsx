import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import DropDown from "../../components/DropDown";
import Stack from "@mui/material/Stack";
import { TextField, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
const Signup = () => {
	const navigate = useNavigate();

	const role = ["Buyer", "Seller"];

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [selectedRole, setSelectedRole] = useState("buyer");

	const optSelected = (opt) => {
		setSelectedRole(opt.toLowerCase());
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

		if (!name || !email || !password || !confirmPassword) {
			toast.error("All Fields are Mandatory", {
				position: "top-left",
			});
			return;
		}
		if (password !== confirmPassword) {
			toast.error("Passwords must match", {
				position: "top-left",
			});
			return;
		}

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
				toast.error(err.response.data.message, {
					position: "top-left",
				});
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

					<Stack width={"100%"}>
						<TextField
							type="text"
							name="name"
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
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
							label="Enter Pasword"
							variant="outlined"
							className="input"
						/>
						<TextField
							type="password"
							name="confirmPassword"
							id="confirmPassword"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							min={6}
							required
							label="Confirm Pasword"
							variant="outlined"
							className="input"
						/>
						<DropDown options={role} selectedOption={optSelected} label="Sign Up as" />
					</Stack>

					<button type="submit">Sign Up</button>
				</form>
			</div>
		</div>
	);
};

export default Signup;
