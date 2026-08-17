const Service = require("../models/Service");
const Merchant = require("../models/Merchant");


// Get all services
exports.getServices = async (req, res) => {

    try {

        const {
            search,
            merchant
        } = req.query;


        let query = {
            available: true
        };


        if (merchant) {

            query.merchant = merchant;

        }


        if (search) {

            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];

        }


        const services =
            await Service.find(query)
                .populate(
                    "merchant",
                    "businessName category rating"
                );


        res.json(services);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Create service
exports.createService = async (req, res) => {

    try {

        const merchant =
            await Merchant.findOne({
                _id: req.body.merchant,
                owner: req.user.id
            });


        if (!merchant) {

            return res.status(403).json({
                message:
                    "You are not authorized to add services"
            });

        }


        const service =
            await Service.create({
                merchant: merchant._id,
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                image: req.body.image,
                duration: req.body.duration
            });


        res.status(201).json({
            message: "Service created successfully",
            service
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Update service
exports.updateService = async (req, res) => {

    try {

        const service =
            await Service.findById(
                req.params.id
            );


        if (!service) {

            return res.status(404).json({
                message: "Service not found"
            });

        }


        const merchant =
            await Merchant.findOne({
                _id: service.merchant,
                owner: req.user.id
            });


        if (!merchant) {

            return res.status(403).json({
                message: "Unauthorized"
            });

        }


        Object.assign(
            service,
            req.body
        );


        await service.save();


        res.json({
            message: "Service updated",
            service
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Delete service
exports.deleteService = async (req, res) => {

    try {

        const service =
            await Service.findById(
                req.params.id
            );


        if (!service) {

            return res.status(404).json({
                message: "Service not found"
            });

        }


        const merchant =
            await Merchant.findOne({
                _id: service.merchant,
                owner: req.user.id
            });


        if (!merchant) {

            return res.status(403).json({
                message: "Unauthorized"
            });

        }


        await service.deleteOne();


        res.json({
            message: "Service deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};