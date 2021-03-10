var PORT = process.env.PORT || 5000;
var express = require("express");
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;

var server = express();

server.use(bodyParser.urlencoded({ extended: true}));
server.use(bodyParser.json());

server.get('/', function (req, res){

    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1> Yo, vous etes sur le serveur API du projet MSPR </h1>');
});


server.use("/mspr/", apiRouter);

// Lance le serveur
server.listen(PORT, function() {
    console.log('Serveur en route!');
});