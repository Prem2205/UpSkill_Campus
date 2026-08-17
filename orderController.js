const Order = require("../models/Order");
const Service = require("../models/Service");
const Merchant = require("../models/Merchant");


// Create order
exports.createOrder = async (req, res) => {

    try {

        const {
            merchant,
            items,
            address
        } = req.body;


        if (!items || items.length === 0) {

            return res.status(400).json({
                message: "Order must contain services"
            });

        }


        const merchantExists =
            await Merchant.findById(merchant);


        if (!merchantExists) {

            return res.status(404).json({
                message: "Merchant not found"
            });

        }


        let orderItems = [];
        let totalAmount = 0;


        for (const item of items) {

            const service =
                await Service.findById(
                    item.service
                );


            if (!service) {

                return res.status(404).json({
                    message:
                        "Service not found: " +
                        item.service
                });

            }


            const quantity =
                item.quantity || 1;


            orderItems.push({
                service: service._id,
                name: service.name,
                price: service.price,
                quantity
            });


            totalAmount +=
                service.price * quantity;

        }


        const order =
            await Order.create({

                customer: req.user.id,

                merchant,

                items: orderItems,

                totalAmount,

                address

            });


        res.status(201).json({
            message: "Order created successfully",
            order
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Customer orders
exports.getCustomerOrders = async (req, res) => {

    try {

        const orders =
            await Order.find({
                customer: req.user.id
            })
            .populate(
                "merchant",
                "businessName"
            )
            .sort({
                createdAt: -1
            });


        res.json(orders);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Merchant orders
exports.getMerchantOrders = async (req, res) => {

    try {

        const merchant =
            await Merchant.findOne({
                owner: req.user.id
            });


        if (!merchant) {

            return res.status(404).json({
                message: "Merchant profile not found"
            });

        }


        const orders =
            await Order.find({
                merchant: merchant._id
            })
            .populate(
                "customer",
                "name email"
            )
            .sort({
                createdAt: -1
            });


        res.json(orders);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Update order status
exports.updateOrderStatus = async (req, res) => {

    try {

        const order =
            await Order.findById(
                req.params.id
            );


        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }


        const merchant =
            await Merchant.findOne({
                _id: order.merchant,
                owner: req.user.id
            });


        if (!merchant) {

            return res.status(403).json({
                message: "Unauthorized"
            });

        }


        order.status =
            req.body.status;


        await order.save();


        res.json({
            message: "Order status updated",
            order
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Demo payment
exports.processPayment = async (req, res) => {

    try {

        const order =
            await Order.findById(
                req.params.id
            );


        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }


        if (
            order.customer.toString() !==
            req.user.id
        ) {

            return res.status(403).json({
                message: "Unauthorized"
            });

        }


        // Demo payment
        order.paymentStatus = "paid";
        order.status = "confirmed";

        await order.save();


        res.json({

            message:
                "Payment successful",

            orderId:
                order._id,

            amount:
                order.totalAmount,

            paymentStatus:
                order.paymentStatus

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};