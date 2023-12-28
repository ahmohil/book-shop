const jwt = require("jsonwebtoken");

exports.checkIfSeller = async (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	let user;
	try {
		user = jwt.verify(token, process.env.JWT_SECRET_KEY);
	} catch {
		console.log(user);
		return res.status(401).json({ message: "You are not logged in" });
	}

	if (!user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	if (user.role !== "seller") {
		return res.status(401).json({ message: "Unauthorized! You can only buy books." });
	}

	next();
};

exports.checkIfBuyer = async (req, res, next) => {
	console.log(req.headers.authorization);
	const token = req.headers.authorization.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	let user;
	try {
		user = jwt.verify(token, process.env.JWT_SECRET_KEY);
	} catch {
		console.log(user);
		return res.status(401).json({ message: "You are not logged in" });
	}

	if (!user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	if (user.role !== "buyer") {
		return res.status(401).json({ message: "Unauthorized! You can only sell books." });
	}
	next();
};

exports.appendUser = async (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];

	if (!token) {
		return res.status(400).json({ message: "You have to login" });
	}

	const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
	if (!user) {
		return res.status(400).json({ message: "Token Expired! Login Again" });
	}
	req.user = user;
	next();
};
