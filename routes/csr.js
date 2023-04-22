const express = require("express");
const router = express.Router();

// express-validator
const { body, param } = require("express-validator");

var CsrController = require("../controllers/CsrController");

router.put("/getAll", CsrController.getCsrAll);
router.put("/:id", CsrController.getCsrById);


module.exports = router;
