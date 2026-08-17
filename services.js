const express = require("express");

const router = express.Router();

const auth =
    require("../middleware/auth");

const {
    getServices,
    createService,
    updateService,
    deleteService
} =
    require("../controllers/serviceController");


// Get services
router.get(
    "/",
    getServices
);


// Create service
router.post(
    "/",
    auth,
    createService
);


// Update service
router.put(
    "/:id",
    auth,
    updateService
);


// Delete service
router.delete(
    "/:id",
    auth,
    deleteService
);


module.exports = router;