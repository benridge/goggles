var express = require("express");
var path = require("path");
var ServerConfig = require('./common');

var port = 80;

var app = express();

app.get('/environment.js', function (req, res) {
  res.json(ServerConfig());
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(port, function() {
  console.log("Server listening on port " + port);
});