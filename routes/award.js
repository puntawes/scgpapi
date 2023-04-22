const express = require("express");
const router = express.Router();

// express-validator
const { body, param } = require("express-validator");

var AwardController = require("../controllers/AwardController");

router.post("/getAward", AwardController.index);

module.exports = router;