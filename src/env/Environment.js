import request from 'superagent';

let serverConfig;

const Environment = {

  getServerConfig() {

    return new Promise((resolve, reject) => {
      if (serverConfig) {
        resolve(serverConfig);
      } else {
        request
          .get('/environment.js')
          .end((res) => {
            const env = res.body;
            serverConfig = env;

            resolve(env);
          });
      }
      });
  }
};

export default Environment;