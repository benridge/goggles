var request = require('superagent');

var serverConfig;

var Environment = {
  getServerConfig: function() {

    return new Promise((resolve, reject) => {
      if (serverConfig) {
        resolve(serverConfig);
      } else {
        request
          .get('/environment.js')
          .end((res) => {
            var env = res.body;
            serverConfig = env;

            resolve(env);
          });
      }
      });
  }
};

module.exports = Environment;