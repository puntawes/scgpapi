const express = require("express");
const router = express.Router();

// express-validator
const { body, param } = require("express-validator");

var ProductController = require("../controllers/ProductController");

router.post("/getSubcategory", ProductController.getSubcategory);
router.post("/getSubcategoryPaper", ProductController.getSubcategoryPaper);
router.post("/getGroupProduct", ProductController.getGroupProduct);
router.post("/getGroup", ProductController.getGroup);
router.post("/getDetailProductPaper", ProductController.getDetailProductPaper);
router.post("/getCategoryId", ProductController.getCategoryId);
router.post("/getSubcategoryId", ProductController.getSubcategoryId);
router.post("/getSubcatId", ProductController.getSubcatId);
router.post("/getProducthead", ProductController.getProducthead);
router.post("/getAllCategory", ProductController.getAllCategory);

module.exports = router;