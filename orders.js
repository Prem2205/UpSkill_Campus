const express = require("express");

const router = express.Router();

const auth =
    require("../middleware/auth");

const {
    createOrder,
    getCustomerOrders,
    getMerchantOrders,
    updateOrderStatus,
    processPayment
} =
    require("../controllers/orderController");


// Create order
router.post(
    "/",
    auth,
    createOrder
);


// Customer order history
router.get(
    "/customer",
    auth,
    getCustomerOrders
);


// Merchant orders
router.get(
    "/merchant",
    auth,
    getMerchantOrders
);


// Update order status
router.put(
    "/:id/status",
    auth,
    updateOrderStatus
);


// Payment
router.post(
    "/:id/pay",
    auth,
    processPayment
);


module.exports = router;