var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// open access api
const cors = require("cors");
// middleware error
const errorHandler = require("./middleware/errorHandler");
const port = 8885;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var newsRouter = require('./routes/news');
var csrRouter = require('./routes/csr');
var contactRouter = require('./routes/contact');
var contactv2Router = require('./routes/contactv2');
var businessspotlightRouter = require('./routes/businessspotlight');
var alotRouter = require('./routes/alot');
var sustainabilityRouter = require('./routes/sustainability');
var productRouter = require('./routes/product');
var menagementRouter = require('./routes/management');
var awardRouter = require('./routes/award');


var app = express();

// use cors open access api
app.use(cors());



// config for env
const config = require("./config/index");
app.set("trust proxy", 1);


app.use(logger('dev'));
app.use(express.json({limit: "1mb", extended: true}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
app.use('/news', newsRouter);
app.use('/csr', csrRouter);
app.use('/contact', contactRouter);
app.use('/contactv2', contactv2Router);
app.use('/business-spotlight', businessspotlightRouter);
app.use('/alot', alotRouter);
app.use('/sustainability', sustainabilityRouter);
app.use('/product', productRouter);
app.use('/member', menagementRouter);
app.use('/award', awardRouter);

// use middleware error
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
module.exports = app;
