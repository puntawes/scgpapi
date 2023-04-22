const express = require("express");
const router = express.Router();

// express-validator
const { body, param } = require("express-validator");

var ManagementController = require("../controllers/ManagementController");

router.post("/getMenagement", ManagementController.index);
// router.post("/getLifeofscgp", ManagementController.getLifeofscgp);
router.post("/getManagementByPathname", ManagementController.getManagementByPathname);

module.exports = router;
