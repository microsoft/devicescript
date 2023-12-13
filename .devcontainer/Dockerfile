# see https://github.com/microsoft/vscode-dev-containers/tree/main/containers
ARG VARIANT="20"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

ENV PATH="/opt/emsdk/upstream/emscripten:${PATH}"

USER root
RUN cd /opt && \
    sudo git clone https://github.com/emscripten-core/emsdk.git && \
    cd /opt/emsdk && \
    sudo ./emsdk install latest && \
    sudo ./emsdk activate latest
