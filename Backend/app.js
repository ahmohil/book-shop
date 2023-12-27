const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/book");
const orderRoutes = require("./routes/order");
const cors = require("cors");

const MONGODB_URI = "mongodb://localhost:27017/Library";

const app = express();

const corsOptions = {
	origin: "http://localhost:5173",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
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
