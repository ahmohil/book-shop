const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/book");
const orderRoutes = require("./routes/order");
const cors = require("cors");

const MONGODB_URI = "mongodb://localhost:27017/Library";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", (req, res, next) => {
	res.status(200).json({ message: "Sever Running" });
});
app.use(authRoutes);
app.use(bookRoutes);
app.use(orderRoutes);

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
