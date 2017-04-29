#
# NOTE: THIS DOCKERFILE IS GENERATED VIA "./hack/update"
#
# DO NOT EDIT IT DIRECTLY.
#
  
FROM node:6-alpine
MAINTAINER AusNimbus <support@ausnimbus.com.au>

EXPOSE 8080

ENV STI_SCRIPTS_PATH=/usr/libexec/s2i \
    HOME=/opt/app-root/src

LABEL summary="Platform for building and running Node.js 6 applications" \
    maintainer="AusNimbus <support@ausnimbus.com.au>" \
    io.k8s.description="Platform for building and running Node.js 6 applications" \
    io.k8s.display-name="Node.js 6" \
    io.openshift.expose-services="8080:http" \
    io.openshift.tags="builder,node" \
    io.openshift.s2i.scripts-url=image:///usr/libexec/s2i

RUN apk --no-cache add bash rsync git && rm -rf /var/cache/apk/* && \
    mkdir -p ${HOME}/.pki/nssdb && \
    chown -R 1001:0 ${HOME}/.pki && \
    adduser -S -u 1001 -G root -h ${HOME} -s /sbin/nologin \
      -g "Default Application User" default && \
    chown -R 1001:0 /opt/app-root

# Copy common executable utilities.
COPY ./common/bin/ /usr/bin/
# Add $HOME/node_modules/.bin to the $PATH, allowing user to make npm scripts
# available on the CLI without using npm's --global installation mode
ENV NPM_CONFIG_PREFIX=$HOME/.npm-global \
    PATH=$HOME/node_modules/.bin/:$HOME/.npm-global/bin/:$PATH

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

CMD /usr/bin/base-usage
ENTRYPOINT ["container-entrypoint"]
