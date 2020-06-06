const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const portal = require("./route");
const fileupload = require("express-fileupload");
const path = require('path');
const cors = require('cors')


let app = express();
let port = 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(fileupload())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/upload_profile', express.static(path.join(__dirname, 'upload_profile')));

app.use(cors())

app.listen(port, () =>{
    console.log("Application Listening on Port " + port)
});

app.use("/api/v1", portal);

module.exports = app
