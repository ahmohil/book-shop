import React, { useState, useRef } from "react";
import { Stepper, Step, StepLabel, Button, Typography, TextField, StepIcon } from "@mui/material";
import "./ResetPass.css";
import "./Auth.css";
import axios from "axios";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";

const steps = ["Enter Email", "Enter OTP", "Set New Password"];

const ForgotPassword = () => {
	const navigate = useNavigate();
	const [activeStep, setActiveStep] = useState(0);
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [resetToken, setResetToken] = useState({});
	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handleOtpChange = (event) => {
		setOtp(event.target.value);
	};

	const submitEmail = async (e) => {
		const res = await toast.promise(
			axios.post("http://localhost:3000/forgot-password", {
				email: email,
			}),
			{
				pending: "Validating email...",
				success: {
					render: ({ data }) => {
						return "OTP has been sent.";
					},
					icon: "✅",
				},
				error: {
					render: ({ data }) => {
						return `${data.response.data.message}`;
					},
					icon: "❌",
				},
			},
			{
				position: "top-left",
			}
		);

		console.log(res);
		handleNext();
	};

	const submitOtp = (e) => {
		e.preventDefault();

		axios
			.post("http://localhost:3000/verify-otp?type=resetpassword", {
				email: email,
				otp: otp,
			})
			.then((res) => {
				setResetToken(res.data.token);
				handleNext();
			})
			.catch((err) => {
				if (err.response) {
					toast.error(err.response.data.message, {
						position: "top-left",
					});
				} else if (err.request) {
					toast.error("Network error.", {
						position: "top-left",
					});
				} else {
					toast.error("An unexpected error occurred. ", {
						position: "top-left",
					});
				}
			});
	};

	const submitPassword = (e) => {
		if (password !== confirmPassword) {
			toast.error("Passwords must match", {
				position: "top-left",
			});
			return;
		}

		axios
			.post("http://localhost:3000/change-password", {
				token: resetToken,
				password: password,
			})
			.then((res) => {
				navigate("/login");
			})
			.catch((err) => {
				if (err.response) {
					toast.error(err.response.data.message, {
						position: "top-left",
					});
				} else if (err.request) {
					toast.error("Network error.", {
						position: "top-left",
					});
				} else {
					toast.error("An unexpected error occurred. ", {
						position: "top-left",
					});
				}
			});
	};

	const resendOtp = () => {
		axios
			.post("http://localhost:3000/resend-otp", {
				email: email,
			})
			.then((res) => {
				toast.success("OTP resent", {
					position: "top-left",
				});
			})
			.catch((err) => {
				if (err.response) {
					toast.error(err.response.data.message, {
						position: "top-left",
					});
				} else if (err.request) {
					toast.error("Network error.", {
						position: "top-left",
					});
				} else {
					toast.error("An unexpected error occurred. ", {
						position: "top-left",
					});
				}
			});
	};
	const getStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<div className="stepper-field">
						<TextField
							label="Enter Email"
							variant="outlined"
							type="email"
							fullWidth
							onChange={handleEmailChange}
							value={email}
						/>
					</div>
				);
			case 1:
				return (
					<div className="stepper-field">
						<TextField
							type="number"
							label="Enter OTP"
							variant="outlined"
							value={otp}
							fullWidth
							onChange={handleOtpChange}
							onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
						/>
					</div>
				);
			case 2:
				return (
					<>
						<div className="stepper-field">
							<TextField
								label="Enter New Password"
								variant="outlined"
								type="password"
								fullWidth
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="stepper-field">
							<TextField
								label="Confirm New Password"
								variant="outlined"
								type="password"
								fullWidth
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</div>
					</>
				);
			default:
				return "Unknown step";
		}
	};

	const CustomStepIcon = (props) => {
		const { active, completed, icon } = props;
		return <StepIcon icon={icon} sx={{ color: active ? "#512da8" : completed ? "#512da8" : "default" }} />;
	};

	return (
		<div className="container active">
			<div className="toggle-container toggle-left">
				<div className="toggle">
					<div className="toggle-panel ">
						<h1>Forgot Password?</h1>
						<br />
						<p>We will send you an OTP on Email just enter it and change your password</p>
						<button className="hidden" id="login" onClick={() => navigate("/login")}>
							Sign In
						</button>
					</div>
				</div>
			</div>
			<div className="form-container sign-up reset-pass">
				<Stepper activeStep={activeStep} alternativeLabel>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel StepIconComponent={(props) => <CustomStepIcon {...props} />}>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				<div>
					{activeStep === steps.length ? (
						<div>
							<Typography>Your password has been changed successfully.</Typography>
							<Button onClick={handleReset}>Reset</Button>
						</div>
					) : (
						<div>
							{getStepContent(activeStep)}
							<div className="stepper-btn-container">
								{activeStep === 0 && (
									<Button variant="contained" color="primary" onClick={submitEmail} className="stepper-btn">
										Verify Email
									</Button>
								)}
								{activeStep === 1 && (
									<div className="otp-btns">
										<Button color="primary" onClick={resendOtp} className="resend-otp-button">
											Resend otp
										</Button>
										<Button variant="contained" color="primary" onClick={submitOtp} className="stepper-btn">
											Verify OTP
										</Button>
									</div>
								)}
								{activeStep === 2 && (
									<Button variant="contained" color="primary" onClick={submitPassword} className="stepper-btn">
										Verify Password
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
