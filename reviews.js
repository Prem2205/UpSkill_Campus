const express = require("express");

const router = express.Router();

const auth =
    require("../middleware/auth");

const {
    addReview,
    getReviews
} =
    require("../controllers/reviewController");


// Add review
router.post(
    "/",
    auth,
    addReview
);


// Get merchant reviews
router.get(
    "/merchant/:merchantId",
    getReviews
);


module.exports = router;