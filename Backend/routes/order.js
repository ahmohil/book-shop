require("dotenv").config();
const express = require("express");
const OrderController = require("../controllers/order");
const router = express.Router();
const authorization = require("../middlewares/authorize");

router.post("/create-order", authorization.checkIfBuyer, authorization.appendUser, OrderController.createOrder);
router.get("/my-orders", authorization.checkIfBuyer, authorization.appendUser, OrderController.getOrders);
router.get("/get-order/:orderId", authorization.checkIfBuyer, authorization.appendUser, OrderController.getOrderById);
router.put("/edit-order/:orderId", authorization.checkIfBuyer, authorization.appendUser, OrderController.editOrder);
router.delete(
	"/delete-order/:orderId",
	authorization.checkIfBuyer,
	authorization.appendUser,
	OrderController.deleteOrder
);

module.exports = router;
