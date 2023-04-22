const express = require("express");
const router = express.Router();

// express-validator
const { body, param } = require("express-validator");

var ContactControllerV2 = require("../controllers/ContactControllerV2");

router.post("/getCountryV2", ContactControllerV2.getCountryV2);
//router.post("/getContactV2", ContactController.getContact);
//router.post("/getBusinessV2", ContactController.getBusiness);
//router.post("/getCompanyV2", ContactController.getCompany);
// router.put("/:id", NewsController.getNewsById);


module.exports = router;