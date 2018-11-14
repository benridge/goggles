var express = require("express");
var path = require("path");
var ServerConfig = require('./common');
var server_port = process.env.PORT || 8081;

var app = express();

app.get('/environment.js', function (req, res) {
  res.json(ServerConfig());
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(server_port, function(){
  console.log("Listening on server_port " + server_port);
});
