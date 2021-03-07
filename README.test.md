# How to test the dockerized version

```bash
export OPS_HOME=$(pwd)


# -- #
# -- # Build the container image
# -- #
docker pull node:12.21.0-buster

export THIS_RECIPE_VERSION="0.0.1"
export THIS_RECIPE_VERSION="feature/delivery2"
# cd ephemeral
export DOCKER_BUILD_CONTEXT=$(mktemp -d -t "DOCKER_BUILD_CONTEXT-XXXXXXXXXX")

# export WHERE_I_WORK=~/iwarehouse
git clone git@github.com:gravitee-lab/consolidator.git ${DOCKER_BUILD_CONTEXT}
cd ${DOCKER_BUILD_CONTEXT}
git checkout ${THIS_RECIPE_VERSION}

cd ${OPS_HOME}

docker build -f ${DOCKER_BUILD_CONTEXT}/Dockerfile -t gio-devops/consolidator:0.0.1 ${DOCKER_BUILD_CONTEXT}/


# -- #
# -- # Setup test data
# -- #
#
# The absolute path to the folder where the Python Script put all the built zip files.
export PREPS_HOME=$(pwd)/tmp
#  the Gravitee release version
export GIO_RELEASE_VERSION="1.25.27"
# The absolute path to the folder where to prepare the folder / files tree structure to sync to the S3 Bucket
export BUCKET_CONTENT_HOME=$(pwd)/tests-bucket-content-home

${DOCKER_BUILD_CONTEXT}/setup-test-data.sh

# -- #
# -- # Then start the container
# -- #

docker run -u root -itd --name gio_consolidator -e GIO_RELEASE_VERSION="$GIO_RELEASE_VERSION" -v ${PREPS_HOME}:/home/node/app/tmp -v ${BUCKET_CONTENT_HOME}:/home/node/app/tests-bucket-content-home -w /home/node/app gio-devops/consolidator:0.0.1 bash

# -- #
# -- # Finally execute the consolidator
# -- #

docker exec -it gio_consolidator bash -c "pwd && ls -allh ."
docker exec -it gio_consolidator bash -c "tsc && npm start"


echo "# ------------------------------------------------------------ #"
echo "Contenu de [BUCKET_CONTENT_HOME] Avant recup : "
echo "# ------------------------------------------------------------ #"
find ${BUCKET_CONTENT_HOME}/ -name *.zip
echo "# ------------------------------------------------------------ #"
cp -fR ${RETRIEVED_BCH}/bch/* ${BUCKET_CONTENT_HOME}/

echo "# ------------------------------------------------------------ #"
echo "Contenu de [BUCKET_CONTENT_HOME] Après recup : "
echo "# ------------------------------------------------------------ #"
find ${BUCKET_CONTENT_HOME}/ -name *.zip
echo "# ------------------------------------------------------------ #"
# --

```
