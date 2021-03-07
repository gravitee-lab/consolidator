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

# The absolute path to the folder where the Python Script put all the built zip files.
export PREPS_HOME=${PREPS_HOME:-$(pwd)/tmp}
#  the Gravitee release version
export GIO_RELEASE_VERSION=${GIO_RELEASE_VERSION:-"1.25.27"}
# The absolute path to the folder where to prepare the folder / files tree structure to sync to the S3 Bucket
export BUCKET_CONTENT_HOME=${BUCKET_CONTENT_HOME:-$(pwd)/tests-bucket-content-home}

# mkdir ${DOCKER_BUILD_CONTEXT}/python-tmp/

# echo "Copying PREPS_HOME content into Docker build context"

# cp -fR ${PREPS_HOME}/* ${DOCKER_BUILD_CONTEXT}/python-tmp/

docker build -f ${DOCKER_BUILD_CONTEXT}/Dockerfile -t gio-devops/consolidator:0.0.1 ${DOCKER_BUILD_CONTEXT}/
