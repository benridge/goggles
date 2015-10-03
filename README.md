
# goggles ![build status](https://travis-ci.org/benridge/goggles.svg?branch=master)
React frontend for the Colorado snow report website waapow.com.

![alt text](screenshot.png "screenshot")

## build
```npm install && grunt build```

## start against prod API
```NODE_ENV=production npm start```

## start against local API
requires local Tomcat running waapow WAR

```npm start```

## License
Unlicensed. Prohibited to use, copy, redistribute.
Contact the author if you are interested in doing something with the code.

## Revision History

### version 2
- Redux implementation. 
- ES6 with babel polyfill.
- Unit and integration tests using Karma/mocha.

### version 1
- React version. Previous (non-public) frontend was written in ExtJS.
- Removed unnecessary functionality, focusing on a fast, simple interface.
- Responsive design (with help from bootstrap).




