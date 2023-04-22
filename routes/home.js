const express = require("express");
const router = express.Router();

// express-validator
const { body, param } = require("express-validator");


var HomeVisionController = require("../controllers/HomeVisionController");
var HomeMetaController = require("../controllers/HomeMetaController");
var HomeBannerController = require("../controllers/HomeBannerController");
var HomeProductController = require("../controllers/HomeProductController");
var HomeServicesController = require("../controllers/HomeServicesController");
var HomeNewsController = require("../controllers/HomeNewsController");
var HomeSolutionController = require("../controllers/HomeSolutionController");
var HomeSpotlightController = require("../controllers/HomeSpotlightController");
var HomePopUpController = require("../controllers/HomePopUpController");
var FooterController = require("../controllers/FooterController");


// test route

router.post("/getVision",HomeVisionController.index);
router.get("/getMeta",HomeMetaController.index);
router.post("/getBanner",HomeBannerController.getHeroBannerHomePage);
router.post("/getProduct",HomeProductController.index);
router.post("/getServices",HomeServicesController.index);
router.post("/getNews",HomeNewsController.index);
router.post("/getSolution",HomeSolutionController.index);
router.post("/getSpotlight",HomeSpotlightController.index);
router.get("/getPopupImage",HomePopUpController.index);
router.post("/getFooter",FooterController.getFooter);


module.exports = router;
