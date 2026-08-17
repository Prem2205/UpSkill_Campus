const express = require("express");

const router = express.Router();

const auth =
    require("../middleware/auth");

const {
    getMerchants,
    getMerchant,
    updateMerchant
} =
    require("../controllers/merchantController");


// Get merchants
router.get(
    "/",
    getMerchants
);


// Get single merchant
router.get(
    "/:id",
    getMerchant
);


// Update merchant profile
router.put(
    "/:id",
    auth,
    updateMerchant
);


module.exports = router;