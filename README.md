# NodeJS S2I Docker images

[![Build Status](https://travis-ci.org/ausnimbus/s2i-nodejs.svg?branch=master)](https://travis-ci.org/ausnimbus/s2i-nodejs)
[![Docker Repository on Quay](https://quay.io/repository/ausnimbus/s2i-nodejs/status "Docker Repository on Quay")](https://quay.io/repository/ausnimbus/s2i-nodejs)

This repository contains the source for the [source-to-image](https://github.com/openshift/source-to-image)
builders used to deploy [NodeJS applications](https://www.ausnimbus.com.au/languages/nodejs/)
on [AusNimbus](https://www.ausnimbus.com.au/).

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

## Variants

Two different variants are made available:

- Default
- Alpine
