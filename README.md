# AusNimbus Builder for Node.js [![Build Status](https://travis-ci.org/ausnimbus/s2i-nodejs.svg?branch=master)](https://travis-ci.org/ausnimbus/s2i-nodejs) [![Docker Repository on Quay](https://quay.io/repository/ausnimbus/s2i-nodejs/status "Docker Repository on Quay")](https://quay.io/repository/ausnimbus/s2i-nodejs)

[![Node.js](https://user-images.githubusercontent.com/2239920/27286574-0a022ccc-5544-11e7-83bd-9f72e132fdfb.jpg)](https://www.ausnimbus.com.au/)

The [AusNimbus](https://www.ausnimbus.com.au/) builder for Node.js provides a fast, secure and reliable [Node.js hosting](https://www.ausnimbus.com.au/languages/nodejs-hosting/) environment.

This document describes the behaviour and environment configuration when running your Node.js apps on AusNimbus.

## Table of Contents

- [Runtime Environments](#runtime-environments)
- [Web Process](#web-process)
- [Dependency Management](#dependency-management)
  - [devDependencies](#devDependencies)
- [Environment Configuration](#environment-configuration)
- [Advanced](#advanced)
  - [Build Customization](#build-customization)
    - [Running AusNimbus specific build steps](#running-ausnimbus-specific-build-steps)
    - [Configuring npm](#configuring-npm)
  - [Application Concurrency](#application-concurrency)
    - [Examples](#examples)
- [Extending](#extending)
  - [Build Stage (assemble)](#build-stage-assemble)
  - [Runtime Stage (run)](#runtime-stage-run)
  - [Persistent Environment Variables](#persistent-environment-variables)
- [Debug Mode](#debug-mode)

## Runtime Environments

AusNimbus supports the latest stable release and each of the LTS releases.

Node.js uses the semantic versioning convention in the form of `$MAJOR.$MINOR.$PATCH`

The currently supported versions are `4.x`, `6.x`, `8.x`

## Web Process

Your application's web processes must bind to port `8080`.

AusNimbus handles SSL termination at the load balancer.

The builder will start your web process by executing `npm run start` or `yarn run start` (see [Dependency Management](#dependency-management) below). Your start [`script`](https://docs.npmjs.com/misc/scripts) can be specified in your `package.json`.

For example:

```json
"scripts": {
  "start": "node express.js"
}
```

If you would like to customize the execution process further you may configure the following environment variable:

NAME        | Description
------------|-------------
NPM_RUN     | Define a custom start script to run from your `package.json`. Default: `start`

## Dependency Management

The builder uses
the [Npm package manager](https://www.npmjs.com/) for installing dependencies and running scripts from your `package.json`.

If a `yarn.lock` file is found, the [Yarn package manager](https://yarnpkg.com/) will be used instead of `npm`.

### devDependencies

By default your application will be built and deployed in `production`. If you would like to install `devDependencies` you will need to set your `NODE_ENV` to `development`.

Remember that including `devDependencies` will slow your entire deployment time, it is recommended you only include the dependencies you need for production builds.

## Environment Configuration

The following environment variables are available for you to configure your Node.js environment:

NAME        | Description
------------|-------------
NODE_ENV    | Node.js environment (Default: "production")
NODE_ARGS   | Arguments passed to the `node` command. By default this value will be automatically tune the environment based on the app instance size.

## Advanced

### Build Customization

If your application has custom build steps you would like to run you can use the [preinstall](https://docs.npmjs.com/misc/scripts) or [postinstall scripts](https://docs.npmjs.com/misc/scripts) in your `package.json`. eg

```json
"scripts": {
  "start": "node server.js",
  "test": "mocha",
  "postinstall": "grunt build"
}
```

#### Running AusNimbus specific build steps

If you would like to run specific scripts when deployed only on AusNimbus.

You may specify the `ausnimbus-prebuild` and/or `ausnimbus-postbuild` scripts.

For example, if you only want to build production assets when deploying to AusNimbus:


```json
"scripts": {
  "ausnimbus-prebuild": "echo we are about to deploy to AusNimbus",
  "ausnimbus-postbuild": "grunt build"
}
```

#### Configuring npm

If you would like to use a custom npm mirror you may use the following environment variable:

NAME        | Description
------------|-------------
NPM_MIRROR  | Define a custom npm registry mirror for downloading dependencies

You can also customize npm further by including a [.npmrc](https://docs.npmjs.com/files/npmrc) file in your project’s root.

### Application Concurrency

Due to the single-threaded design of Node.js, it doesn't fully take advantage of multiple CPU cores and additional memory. Instead it is recommended to fork multiple process using Node.js [clustering](http://nodejs.org/api/cluster.html). This will allow you to fully utilize the available resources.

The AusNimbus builder allows you to configure a convenient `WEB_MEMORY` environment variable. The value should be set in MB to the expected memory requirements of your application.

`WEB_CONCURRENCY` and `NODE_ARGS` will be automatically tuned based on your `WEB_MEMORY` value.

NAME             | Description
-----------------|-------------
WEB_MEMORY       | Specify expected memory requirements of your application in MB (ie. 512)
WEB_CONCURRENCY  | Automatically calculated variable based on `MEMORY_AVAILABLE / WEB_MEMORY`
NODE_ARGS        | Arguments passed to the `node` command. By default this value will be automatically tune the environment based on your app instance size.

#### Examples

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

Another example with [Throng](https://github.com/hunterloftis/throng):

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

## Extending

AusNimbus builders are split into two stages:

- Build
- Runtime

Both stages are completely extensible, allowing you to customize or completely overwrite each stage.

### Build Stage (assemble)

If you want to customize the build stage, you need to add the executable `.s2i/bin/assemble` file in your repository.

This file should contain the logic required to build and install any dependencies your application requires.

If you only want to extend the build stage, you may use this example:

```sh
#!/bin/bash

echo "Logic to include before"

# Run the default builder logic
. /usr/libexec/s2i/assemble

echo "Logic to include after"
```

### Runtime Stage (run)

If you only want to change the executed command for the run stage you may the following environment variable.

NAME        | Description
------------|-------------
APP_RUN     | Define a custom command to start your application. eg. `node server.js`

**NOTE:** `APP_RUN` will overwrite any builder's runtime configuration (including the [Debug Mode](#Debug Mode) section)

Alternatively you may customize or overwrite the entire runtime stage by including the executable file `.s2i/bin/run`

This file should contain the logic required to execute your application.

If you only want to extend the run stage, you may use this example:

```sh
#!/bin/bash

echo "Logic to include before"

# Run the default builder logic
. /usr/libexec/s2i/run
```

As the run script executes every time your application is deployed, scaled or restarted it's recommended to keep avoid including complex logic which may delay the start-up process of your application.

### Persistent Environment Variables

The recommend approach is to set your environment variables in the AusNimbus dashboard.

However it is possible to store environment variables in code using the `.s2i/environment` file.

The file expects a key=value format eg.

```
KEY=VALUE
FOO=BAR
```

## Debug Mode

The AusNimbus builder provides a convenient environment variable to help you debug your application.

NAME        | Description
------------|-------------
DEBUG       | When set to "TRUE", `nodemon` will be used to automatically reload the server while you work (default: "false"). Setting `DEBUG` to "TRUE" will also change the `NODE_ENV` default to "development" (if not explicitly set).
