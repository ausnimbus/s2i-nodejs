# NodeJS S2I Docker images

[![Build Status](https://travis-ci.org/ausnimbus/s2i-nodejs.svg?branch=master)](https://travis-ci.org/ausnimbus/s2i-nodejs)
[![Docker Repository on Quay](https://quay.io/repository/ausnimbus/s2i-nodejs/status "Docker Repository on Quay")](https://quay.io/repository/ausnimbus/s2i-nodejs)

This repository contains the source for the [source-to-image](https://github.com/openshift/source-to-image)
builders used to deploy [NodeJS applications](https://www.ausnimbus.com.au/languages/nodejs/)
on [AusNimbus](https://www.ausnimbus.com.au/).

The builders are built using NodeJS binaries from nodejs.org

The Yarn package manager is included and will be used over NPM if a `yarn.lock` file exists.

If you are interested in using SCL-based NodeJS binaries, use [s2i-nodejs-scl](https://github.com/ausnimbus/s2i-nodejs-scl)

## Environment Variables

The following ENV variables are made available:

NAME        | Description
------------|-------------
NODE_ENV    | NodeJS runtime mode (default: "production")
DEV_MODE    | When set to "true", `nodemon` will be used to automatically reload the server while you work (default: "false"). Setting `DEV_MODE` to "true" will change the `NODE_ENV` default to "development" (if not explicitly set).
NPM_RUN     | Select an alternate / custom runtime mode, defined in your `package.json` file's [`scripts`](https://docs.npmjs.com/misc/scripts) section (default: npm run "start"). These user-defined run-scripts are unavailable while `DEV_MODE` is in use.
NODE_ARGS   | Arguments passed to `node`. Default is used to auto tune maximum memory.
HTTP_PROXY  | Use a npm proxy during assembly
HTTPS_PROXY | Use a npm proxy during assembly
NPM_MIRROR  | Use a custom NPM registry mirror to download packages during the build process


## Versions

The versions currently supported are:

- 4.8
- 6.10
- 7.9
