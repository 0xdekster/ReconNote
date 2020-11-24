FROM ubuntu:20.04

## update
RUN apt-get -y update &&\
    apt-get -y upgrade

## intall make uuid vim curl unzip
RUN apt-get -y install make uuid vim curl unzip

## intall python
RUN apt-get -y install python3

## install go
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get -y install golang

## install nodejs 12
RUN curl -k -sL https://deb.nodesource.com/setup_12.x | bash - &&\
    apt-get install -y nodejs

## install yarn 1.22
RUN apt-get install -y gnupg &&\
    curl -k -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
    apt-get -y update &&\
    apt-get -y remove cmdtest &&\
    apt-get -y install yarn

## install git
RUN apt-get -y install git

## install Chromium (for aquatone)
RUN mkdir -p /opt/chromium/chromium-latest-linux
WORKDIR /opt/chromium
RUN apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm-dev
RUN git clone https://github.com/scheib/chromium-latest-linux
RUN cd chromium-latest-linux && git checkout 4f4e9b85ea02a109e071452de936389cc2fd7376
RUN ./chromium-latest-linux/update.sh && ln -s /opt/chromium/chromium-latest-linux/latest/chrome /usr/bin/chromium

## install deksterecon
WORKDIR /
RUN apt-get -y install wget sudo
ADD https://api.github.com/repos/0xdekster/deksterecon/git/refs/heads/master version.json
RUN git clone -b master https://github.com/0xdekster/deksterecon.git
RUN echo "Cloned deksterecon.git"
RUN (cd deksterecon && echo "HEAD is at `git rev-parse HEAD`")

## export paths
ENV PATH="/usr/local/go/bin:${PATH}"
ENV PATH="/root/go/bin:${PATH}"

## run install.sh
RUN cd deksterecon &&\
    echo "HEAD is at `git rev-parse HEAD`" &&\
    chmod +x install.sh &&\
    /bin/bash install.sh

## copy web app

RUN mkdir -p /backend
ADD ./src /backend
RUN cd /backend &&\
    yarn install

# This is the path where reports are generated
RUN mkdir -p /var/www/html

# set variables and expose ports
ENV HOST=0.0.0.0
ENV API_HOST=0.0.0.0
ENV PORT=3000
ENV SCANS_OUTPUT_DIR_PATH="/var/www/html"
EXPOSE 3000

WORKDIR /backend
# CMD [ "yarn", "nuxt" ]
CMD [ "yarn", "deploy" ]
# CMD tail -f /dev/null
