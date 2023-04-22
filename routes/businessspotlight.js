const express = require("express");
const router = express.Router();

// express-validator
const { body, param } = require("express-validator");

var BusinessSpotlightController = require("../controllers/BusinessSpotlight");


router.post("/getHighlight", BusinessSpotlightController.getBusinessSpotlightHighlight);
router.post("/getAll", BusinessSpotlightController.getBusinessSpotlightControllerAll);
router.post("/:id", BusinessSpotlightController.getBusinessSpotlightControllerById);


module.exports = router;
