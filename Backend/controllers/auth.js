const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../models/otp");
const nodemailer = require("nodemailer");
const otpMiddleware = require("../middlewares/otp");

exports.signup = async (req, res, next) => {
	const { name, email, password, role } = req.body;
	const usr = await User.findOne({ email: email });
	if (usr) {
		console.log(usr);
		console.log(usr.otpVerified == false);
		if (!usr.otpVerified) {
			req.mailText = `Hi ${usr.name} `;
			await otpMiddleware.sendOTP(req, res, next);
			return res.status(201).json({
				exists: true,
				message:
					"You haven't verified your account yet, please verify your account by entering below the OTP sent to your email",
			});
		}
		return res.status(401).json({ message: "User already exists" });
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = new User({
		name: name,
		email: email,
		password: hashedPassword,
		role: role,
	});
	try {
		const result = await user.save();
		req.mailText = `Hi ${user.name},\n\nYour account has been created just verify your email with the below otp\n\n`;
		await otpMiddleware.sendOTP(req, res, next);
		res.status(201).json({
			message:
				"Your account has been created, now you need to verify your email by entering the OTP sent to your email",
			result: result,
		});
	} catch (error) {
		return res.status(500).json(error);
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email: email });
	console.log(user);
	if (!user) {
		return res.status(401).json({ message: "Invalid email or password" });
	}
	if (!user.otpVerified) {
		req.mailText = `Hi ${user.name} `;
		await otpMiddleware.sendOTP(req, res, next);
		return res.status(201).json({
			isVerified: false,
			message:
				"You haven't verified your account yet, please verify your account by entering below the OTP sent to your email",
		});
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		const error = new Error("Invalid password");
		error.statusCode = 401;
		return res.status(500).json({ message: "Invalid email or password" });
	}

	const token = jwt.sign(
		{
			userId: user._id.toString(),
			email: user.email,
			role: user.role,
		},
		process.env.JWT_SECRET_KEY
	);

	const usr = {
		name: user.name,
		role: user.role.toLowerCase(),
	};

	//	console.log(usr);

	return res.status(200).json({
		message: "Login successful",
		isVerified: true,
		user: usr,
		token: token,
	});
};

exports.forgotPassword = async (req, res, next) => {
	const email = req.body.email;

	const user = await User.findOne({ email: email });
	if (!user) {
		return res.status(401).json({ message: "No such user exists" });
	}

	await otpMiddleware.sendOTP(req, res, next);
	return res.status(200).json({ message: "Enter the otp received on your email" });
};

exports.resendOtp = async (req, res, next) => {
	const email = req.body.email;
	const user = User.findOne({ email: email });
	req.mailText = `Hi ${user.name},\n\nYour new otp is\n\n`;
	const otp = await otp.findOne({ email: email });

	if (!otp) {
		await otpMiddleware.sendOTP(req, res, next);
	} else {
		await otp.deleteOne();
		await otpMiddleware.sendOTP(req, res, next);
	}

	return res.status(200).json({
		message: "OTP resent successfully!",
	});
};

exports.changePassword = async (req, res, next) => {
	const user = jwt.verify(req.body.token, process.env.JWT_SECRET_KEY);
	const newPassword = req.body.password;
	console.log(user);
	const usr = await User.findOne({ email: user.email });
	console.log(usr);

	usr.password = await bcrypt.hash(newPassword, 10);
	await usr.save();

	return res.status(200).json({ message: "Password Changed. You can now login with the new password" });
};

exports.verifyOtp = async (req, res, next) => {
	const type = req.query.type;
	console.log(req.params);

	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return res.status(401).json({ message: "User does not exist" });
	}

	if (type == "resetpassword") {
		const token = jwt.sign(
			{
				userId: user._id.toString(),
				email: user.email,
			},
			process.env.JWT_SECRET_KEY
		);
		res.status(200).json({
			message: "Otp has been verified enter new Password",
			token: token,
		});
	} else {
		try {
			const user = await User.findOne({ email: req.body.email });
			if (!user) {
				return res.status(401).json({ message: "Invalid email" });
			}
			user.otpVerified = true;
			await user.save();

			return res.status(200).json({
				message: "Email Verified. You can now login",
			});
		} catch (error) {
			return res.status(500).json(error);
		}
	}
};

exports.paginate = async (req, res, next) => {
	try {
		const pageNumber = Number(req.query.page) || 1;
		const itemsPerPage = Number(req.query.itemsPerPage) || 10;

		const options = {
			page: pageNumber,
			limit: itemsPerPage,
		};

		const result = await Book.paginate({}, options);
		res.status(200).json({
			pageNumber: result.page,
			totalPages: result.totalPages,
			totalBooks: result.totalDocs,
			hasNextPage: result.hasNextPage,
			hasPrevPage: result.hasPrevPage,
			books: result.docs,
		});
	} catch {
		console.error(err);
		res.status(500).json({
			message: "Internal Server Error",
			error: err.message,
		});
	}
};

exports.getUser = async (req, res, next) => {
	const usr = await User.findOne({ _id: req.user.userId });
	console.log(usr);
	return res.status(200).json({
		user: {
			name: usr.name,
			email: usr.email,
			role: usr.role.toLowerCase(),
		},
	});
};
