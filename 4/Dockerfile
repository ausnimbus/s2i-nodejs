FROM node:4-alpine
MAINTAINER AusNimbus <support@ausnimbus.com.au>

EXPOSE 8080

ENV STI_SCRIPTS_PATH=/usr/libexec/s2i \
    HOME=/opt/app-root/src

LABEL io.openshift.s2i.scripts-url=image:///usr/libexec/s2i

RUN apk add --update bash python && rm -rf /var/cache/apk/* && \
    mkdir -p ${HOME}/.pki/nssdb && \
    chown -R 1001:0 ${HOME}/.pki && \
    adduser -S -u 1001 -G root -h ${HOME} -s /sbin/nologin \
      -g "Default Application User" default && \
    chown -R 1001:0 /opt/app-root

# Copy executable utilities.
COPY bin/ /usr/bin/

# Add $HOME/node_modules/.bin to the $PATH, allowing user to make npm scripts
# available on the CLI without using npm's --global installation mode
# This image will be initialized with "npm run $NPM_RUN"
# See https://docs.npmjs.com/misc/scripts, and your repo's package.json
# file for possible values of NPM_RUN
ENV NPM_RUN=start \
    NPM_CONFIG_PREFIX=$HOME/.npm-global \
    PATH=$HOME/node_modules/.bin/:$HOME/.npm-global/bin/:$PATH

LABEL summary="Platform for building and running Node.js 4 applications" \
    io.k8s.description="Platform for building and running Node.js 4 applications" \
    io.k8s.display-name="Node.js 4" \
    io.openshift.expose-services="8080:http" \
    io.openshift.tags="builder,nodejs,nodejs4" \
    com.redhat.dev-mode="DEV_MODE:false" \
    com.redhat.deployments-dir="/opt/app-root/src" \
    com.redhat.dev-mode.port="DEBUG_PORT:5858"

# Copy the S2I scripts from the specific language image to $STI_SCRIPTS_PATH
COPY ./s2i/bin/ $STI_SCRIPTS_PATH

# Each language image can have 'contrib' a directory with extra files needed to
# run and build the applications.
COPY ./contrib/ /opt/app-root

# Directory with the sources is set as the working directory so all STI scripts
# can execute relative to this path.
WORKDIR ${HOME}

# Drop the root user and make the content of /opt/app-root owned by user 1001
RUN chown -R 1001:0 /opt/app-root && chmod -R ug+rwx /opt/app-root
USER 1001

CMD $STI_SCRIPTS_PATH/usage
ENTRYPOINT ["container-entrypoint"]
