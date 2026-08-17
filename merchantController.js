const Merchant = require("../models/Merchant");


// Get all merchants
exports.getMerchants = async (req, res) => {

    try {

        const {
            category,
            search
        } = req.query;


        let query = {
            isActive: true
        };


        if (category) {

            query.category = category;

        }


        if (search) {

            query.$or = [
                {
                    businessName: {
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


        const merchants =
            await Merchant.find(query)
                .populate(
                    "owner",
                    "name email"
                );


        res.json(merchants);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Get merchant by ID
exports.getMerchant = async (req, res) => {

    try {

        const merchant =
            await Merchant.findById(req.params.id)
                .populate(
                    "owner",
                    "name email"
                );


        if (!merchant) {

            return res.status(404).json({
                message: "Merchant not found"
            });

        }


        res.json(merchant);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Update merchant
exports.updateMerchant = async (req, res) => {

    try {

        const merchant =
            await Merchant.findOne({
                _id: req.params.id,
                owner: req.user.id
            });


        if (!merchant) {

            return res.status(404).json({
                message: "Merchant not found"
            });

        }


        Object.assign(
            merchant,
            req.body
        );


        await merchant.save();


        res.json({
            message: "Merchant updated successfully",
            merchant
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};