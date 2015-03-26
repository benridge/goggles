var express = require("express");
var path = require("path");
var ServerConfig = require('./common');
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var app = express();

app.get('/environment.js', function (req, res) {
  res.json(ServerConfig());
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});
