#!/bin/bash



if [ "x${OPS_HOME}" == "x" ]; then
  echo "OPS_HOME is not set, but must be."
fi;





# cd ephemeral
export DOCKER_BUILD_CONTEXT=$(mktemp -d -t "DOCKER_BUILD_CONTEXT-XXXXXXXXXX")

# export WHERE_I_WORK=~/iwarehouse
export THIS_RECIPE_VERSION=${THIS_RECIPE_VERSION:-"feature/delivery2"}
git clone git@github.com:gravitee-lab/consolidator.git ${DOCKER_BUILD_CONTEXT}
cd ${DOCKER_BUILD_CONTEXT}
git checkout ${THIS_RECIPE_VERSION}

cd ${OPS_HOME}

# ----- put the Source code into the docker build context

# docker pull node:12.21.0-buster


# mkdir ${DOCKER_BUILD_CONTEXT}/python-tmp/

# echo "Copying PREPS_HOME content into Docker build context"

# cp -fR ${PREPS_HOME}/* ${DOCKER_BUILD_CONTEXT}/python-tmp/

docker build -f ${DOCKER_BUILD_CONTEXT}/Dockerfile -t gio-devops/consolidator:0.0.1 ${DOCKER_BUILD_CONTEXT}/



if [ "x${PREPS_HOME}" == "x" ]; then
  echo "PREPS_HOME is not set, but must be."
fi;

if [ "x${GIO_RELEASE_VERSION}" == "x" ]; then
  echo "GIO_RELEASE_VERSION is not set, but must be."
fi;

if [ "x${BUCKET_CONTENT_HOME}" == "x" ]; then
  echo "BUCKET_CONTENT_HOME is not set, but must be."
fi;

./setup-test-data.sh
