var express = require("express");
var path = require("path");

var port = 80;

var app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(port, function() {
  console.log("Server listening on port " + port);
});