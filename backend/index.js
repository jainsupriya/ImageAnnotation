var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var fs = require('fs-extra'); // import fs-extra package

const multer = require('multer');

//Storing documents/Images
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
       cb(null, './uploads');
   }
   , filename: (req, file, cb) => {
       cb(null, file.originalname);
   },
});

const upload = multer({ storage });

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({
   secret              : 'cmpe273_canvas',
   resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
   saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
   duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
   activeDuration      :  5 * 60 * 1000
}));

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

 app.post('/upload-image', upload.array('images', 5), (req, res) => {
    res.status(200).send("Image uploaded successfully");
 });
 app.post('/download-image/:image(*)', (req, res) => {
    var file = req.params.image;
    var filelocation = path.join(__dirname + '/uploads', file);
    var img = fs.readFileSync(filelocation);
    var base64img = new Buffer(img).toString('base64');
    res.writeHead(200, {
        'Content--type': 'image/jpg'
    });
    res.end(base64img);
 });
 

app.listen(3001);
module.exports = app