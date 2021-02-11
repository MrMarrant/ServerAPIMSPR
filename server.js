var PORT = process.env.PORT || 8080;
var express = require("express");

var server = express();

server.get('/', function (req, res){

    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1> Yo, vous etes sur le serveur API du projet MSPR </h1>');
});


// Lance le serveur
server.listen(PORT, function() {
    console.log('Serveur en route!');
});