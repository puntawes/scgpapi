const express = require("express");
const router = express.Router();

// express-validator
const { body, param } = require("express-validator");

var SustainabilityController = require("../controllers/SustainabilityController");

router.post("/getAll", SustainabilityController.index);
router.post("/getSubtain", SustainabilityController.getSubtain);
router.post("/getSubtainv2", SustainabilityController.getSubtainv2);

module.exports = router;