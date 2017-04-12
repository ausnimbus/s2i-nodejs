# NodeJS S2I Docker images

[![Build Status](https://travis-ci.org/ausnimbus/s2i-nodejs.svg?branch=master)](https://travis-ci.org/ausnimbus/s2i-nodejs)
[![Docker Repository on Quay](https://quay.io/repository/ausnimbus/s2i-nodejs/status "Docker Repository on Quay")](https://quay.io/repository/ausnimbus/s2i-nodejs)

This repository contains the source for building various versions of
the Node.JS application as a reproducible Docker image
[source-to-image](https://github.com/openshift/source-to-image)
to be run on [AusNimbus](https://www.ausnimbus.com.au/).

Images are built with Nodejs binaries from nodejs.org.
The resulting image can be run using [Docker](http://docker.io).

Yarn is packaged with this image. If a yarn.lock file is included
in the source repository, yarn will be used opposed to npm

If you are interested in using SCL-based nodejs binaries, use [s2i-nodejs-scl](https://github.com/ausnimbus/s2i-nodejs-scl)

## Versions

The versions currently supported are:

- 4.8.2
- 6.10.2
- 7.8.0
