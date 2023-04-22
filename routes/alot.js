const express = require("express");
const router = express.Router();

// express-validator
const { body, param } = require("express-validator");

var AlotController = require("../controllers/AlotController");

router.post("/getHighlight", AlotController.getAlothighlight);
router.post("/getAll", AlotController.getAlotAll);

// router.put("/:id", AlotController.getCsrById);


module.exports = router;
