const express = require("express");
const router = express.Router();

// express-validator
const { body, param } = require("express-validator");

var NewsController = require("../controllers/NewsController");

router.post("/getNewsAll", NewsController.getNewsAll);
router.post("/getNewsHighlight", NewsController.getNewsAllHighlight);
router.post("/getNewsHighlightByCategory", NewsController.getHighlight);
router.post("/:id", NewsController.getNewsById);

module.exports = router;
