var express = require('express');
var router = express.Router();
// const sequelizer = require('../config/db');
const { hero_banner_page } = require("../models");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a 22ee22111');
});

router.get('/test', async function(req, res, next) {
  const aa = await hero_banner_page.findAll();
  res.send(aa);
});


router.get('/home/hero-banner',(req, res)=>{
  // res.json({
  //   success: true,
  // })
  sequelizer.query(`
      SELECT * FROM admin_scgp.hero_banner_id;
  `).then(([data])=>{
    res.json({
      success: true,
      data: data
    })
  })
  .catch((err)=>{
    res.json({
      success: false,
      message: err,
    })
  })
})

module.exports = router;
