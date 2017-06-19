# AusNimbus Builder for Node.js [![Build Status](https://travis-ci.org/ausnimbus/s2i-nodejs.svg?branch=master)](https://travis-ci.org/ausnimbus/s2i-nodejs) [![Docker Repository on Quay](https://quay.io/repository/ausnimbus/s2i-nodejs/status "Docker Repository on Quay")](https://quay.io/repository/ausnimbus/s2i-nodejs)

[![Node.js](https://user-images.githubusercontent.com/2239920/27286574-0a022ccc-5544-11e7-83bd-9f72e132fdfb.jpg)](https://www.ausnimbus.com.au/)

[AusNimbus](https://www.ausnimbus.com.au/) builder for Node.js provides a fast, secure and reliable [Node.js hosting](https://www.ausnimbus.com.au/languages/nodejs-hosting/) environment.

It uses NPM for dependency management. Web processes must bind to port `8080`, and only the HTTP protocol is permitted for incoming connections.

The Yarn package manager is included and will be used over NPM if a `yarn.lock` file exists.

## Environment Variables

The following ENV variables are made available:

NAME        | Description
------------|-------------
NODE_ENV    | NodeJS runtime mode (default: "production")
NPM_RUN     | Select an alternate / custom runtime mode, defined in your `package.json` file's [`scripts`](https://docs.npmjs.com/misc/scripts) section (default: npm run "start"). These user-defined run-scripts are unavailable while `DEBUG` is in use.
DEBUG       | When set to "TRUE", `nodemon` will be used to automatically reload the server while you work (default: "false"). Setting `DEBUG` to "TRUE" will also change the `NODE_ENV` default to "development" (if not explicitly set).
NODE_ARGS   | Arguments passed to `node`. Default is used to auto tune maximum memory.
NPM_MIRROR  | Use a custom NPM registry mirror to download packages during the build process

## Versions

The versions currently supported are:

- 4
- 6
- 8
