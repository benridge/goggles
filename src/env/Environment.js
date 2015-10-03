import fetch from 'isomorphic-fetch';

let serverConfig;

const Environment = {

  getServerConfig() {

    return new Promise((resolve, reject) => {
      if (serverConfig) {
        resolve(serverConfig);
      } else {
        fetch('/environment.js')
          .then(response => response.json())
          .then(json => {
            serverConfig = json;
            resolve(serverConfig);
          });
      }
      });
  }
};

export default Environment;