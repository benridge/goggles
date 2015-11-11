var env = require("./env.json");

var common = function() {
  var node_env = process.env.NODE_ENV || 'local';
  return env[node_env];
};

module.exports = common;