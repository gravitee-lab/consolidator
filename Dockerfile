FROM node:12.21.0-buster

RUN apt-get update -y && apt-get install -y tree curl

# ARG PREPS_HOME=/home/node/app/python-tmp
ARG PREPS_HOME=/home/node/app/tmp
ARG GIO_RELEASE_VERSION
ARG BUCKET_CONTENT_HOME=/home/node/app/tests-bucket-content-home

ENV PREPS_HOME=${PREPS_HOME}
ENV GIO_RELEASE_VERSION=${GIO_RELEASE_VERSION}
ENV BUCKET_CONTENT_HOME=${BUCKET_CONTENT_HOME}

RUN mkdir -p /tpm/app-gen/
COPY . /home/node/app/
RUN echo "checking all source code is in [/home/node/app/] : "
RUN ls -allh /home/node/app/
RUN cd /home/node/app/ && npm i -g typescript && npm i
RUN ls -allh /home/node/app/
RUN tree /home/node/app/src

WORKDIR /home/node/app
# RUN mkdir -p
# RUN mkdir -p

# copy entire folder
# COPY ./python-tmp/ /
# COPY ./bch/ /

RUN sha512sum --version
RUN md5sum --version


CMD ["/home/node/app/startapp.sh"]
