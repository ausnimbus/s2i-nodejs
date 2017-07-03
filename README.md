# AusNimbus Builder for Node.js [![Build Status](https://travis-ci.org/ausnimbus/s2i-nodejs.svg?branch=master)](https://travis-ci.org/ausnimbus/s2i-nodejs) [![Docker Repository on Quay](https://quay.io/repository/ausnimbus/s2i-nodejs/status "Docker Repository on Quay")](https://quay.io/repository/ausnimbus/s2i-nodejs)

[![Node.js](https://user-images.githubusercontent.com/2239920/27286574-0a022ccc-5544-11e7-83bd-9f72e132fdfb.jpg)](https://www.ausnimbus.com.au/)

The [AusNimbus](https://www.ausnimbus.com.au/) builder for Node.js provides a fast, secure and reliable [Node.js hosting](https://www.ausnimbus.com.au/languages/nodejs-hosting/) environment.

It uses NPM for dependency management. Web processes must bind to port `8080`, and only the HTTP protocol is permitted for incoming connections.

The Yarn package manager is included and will be used over NPM if a `yarn.lock` file exists.

## Environment Variables

NAME        | Description
------------|-------------
NODE_ENV    | NodeJS runtime mode (default: "production")
NPM_RUN     | Select an alternate / custom runtime mode, defined in your `package.json` file's [`scripts`](https://docs.npmjs.com/misc/scripts) section (default: npm run "start"). These user-defined run-scripts are unavailable while `DEBUG` is in use.
DEBUG       | When set to "TRUE", `nodemon` will be used to automatically reload the server while you work (default: "false"). Setting `DEBUG` to "TRUE" will also change the `NODE_ENV` default to "development" (if not explicitly set).
NODE_ARGS   | Arguments passed to `node`. By default it will automatically tune the environment based on your memory limit.
NPM_MIRROR  | Use a custom NPM registry mirror to download packages during the build process

### Application Concurrency (Clustering)

Due to the single-threaded design of Node.js, it doesn't fully take advantage of multiple CPU cores and additional memory. Instead it is recommended to fork multiple process using Node.js [clustering](http://nodejs.org/api/cluster.html). This will allow you to fully utilize the available resources.

A simple example with `cluster`:

```javascript
var cluster = require('cluster');
var WORKERS = process.env.WEB_CONCURRENCY || 1;

// Code to run if we're in the master process
if (cluster.isMaster) {
  // Create a worker for each WORKERS
  for (var i = 0; i < WORKERS; i += 1) {
      cluster.fork();
  }
// Code to run if we're in a worker process
} else {
  // ...
}
```

Another example with [throng](https://github.com/hunterloftis/throng):

```javascript
var throng  = require('throng');
var WORKERS = process.env.WEB_CONCURRENCY || 1;

// Entrypoint for our new clustered process
function start() {
  // ...
}

throng({
  workers: WORKERS,
  lifetime: Infinity,
  start: start
});
```

The AusNimbus builder provides you with a convenient `WEB_MEMORY` environment variable. The value should be set in MB to the expected memory requirements of your application.

`WEB_CONCURRENCY` and `NODE_ARGS` will be automatically tuned based on your `WEB_MEMORY` value.

NAME             | Description
-----------------|-------------
WEB_MEMORY       | Specify expected memory requirements of your application in MB (ie. 512)
WEB_CONCURRENCY  | Automatically calculated variable based on `MEMORY_AVAILABLE / WEB_MEMORY`
NODE_ARGS        | Arguments passed to `node`. By default it will automatically tune the environment based on your memory limit.

## Versions

The versions currently supported are:

- 4
- 6
- 8
