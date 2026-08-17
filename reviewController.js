const Review = require("../models/Review");
const Merchant = require("../models/Merchant");


// Add review
exports.addReview = async (req, res) => {

    try {

        const {
            merchant,
            rating,
            comment
        } = req.body;


        const merchantExists =
            await Merchant.findById(merchant);


        if (!merchantExists) {

            return res.status(404).json({
                message: "Merchant not found"
            });

        }


        const review =
            await Review.create({

                customer: req.user.id,

                merchant,

                rating,

                comment

            });


        // Recalculate rating
        const reviews =
            await Review.find({
                merchant
            });


        const totalRating =
            reviews.reduce(
                (sum, review) =>
                    sum + review.rating,
                0
            );


        merchantExists.rating =
            totalRating / reviews.length;

        merchantExists.reviewCount =
            reviews.length;


        await merchantExists.save();


        res.status(201).json({

            message:
                "Review submitted successfully",

            review

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Get merchant reviews
exports.getReviews = async (req, res) => {

    try {

        const reviews =
            await Review.find({
                merchant: req.params.merchantId
            })
            .populate(
                "customer",
                "name"
            )
            .sort({
                createdAt: -1
            });


        res.json(reviews);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};