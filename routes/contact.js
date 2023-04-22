const express = require("express");
const router = express.Router();

// express-validator
const { body, param } = require("express-validator");

var ContactController = require("../controllers/ContactController");

//router.get("/getCountry", ContactController.getCountry);
router.post("/getContact", ContactController.getContact);
router.post("/getBusiness", ContactController.getBusiness);
router.post("/getCompany", ContactController.getCompany);
// router.put("/:id", NewsController.getNewsById);
router.post("/getCountry", ContactController.getCountry);
router.post("/getProvince", ContactController.getProvince);
router.post("/getBranchTitle", ContactController.getBranchTitle);
router.post("/getEmail", ContactController.getEmail);
router.post("/getLatlng", ContactController.getLatlng);

module.exports = router;
