var PORT = process.env.PORT || 5000;
var express = require("express");
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');



var server = express();

console.log('yo');
server.use(bodyParser.urlencoded({ extended: true}));
server.use(bodyParser.json());
console.log('lol');
server.get('/', function (req, res){

    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1> Yo, vous etes sur le serveur API du projet MSPR </h1>');
});


server.use("/mspr/", apiRouter);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Lance le serveur
server.listen(PORT, function() {
    console.log('Serveur en route!');
});