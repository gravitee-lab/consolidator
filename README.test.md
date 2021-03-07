# How to test the dockerized version

```bash
export OPS_HOME=$(pwd)

# -- #
# -- # First set up test data
# -- #

# The absolute path to the folder where the Python Script put all the built zip files.
export PREPS_HOME=$(pwd)/tmp
#  the Gravitee release version
export GIO_RELEASE_VERSION="1.25.27"
# The absolute path to the folder where to prepare the folder / files tree structure to sync to the S3 Bucket
export BUCKET_CONTENT_HOME=$(pwd)/tests-bucket-content-home

./setup-test-data.sh

# -- #
# -- # Then build the container image
# -- #
docker pull node:12.21.0-buster

export THIS_RECIPE_VERSION="0.0.1"
export THIS_RECIPE_VERSION="feature/delivery2"

./test-dockerized.sh


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

* test data set :

```bash
# The absolute path to the folder where the Python Script put all the built zip files.
export PREPS_HOME=$(pwd)/tmp
#  the Gravitee release version
export GIO_RELEASE_VERSION="1.25.27"
# The absolute path to the folder where to prepare the folder / files tree structure to sync to the S3 Bucket
export BUCKET_CONTENT_HOME=$(pwd)/tests-bucket-content-home


mkdir -p ${BUCKET_CONTENT_HOME}

mkdir  -p ${PREPS_HOME}/${GIO_RELEASE_VERSION}/dist/graviteeio/rep1/rep2/rep3
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/dist/graviteeio/example1.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/dist/graviteeio/rep1/example2.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/dist/graviteeio/rep1/rep2/example3.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/dist/graviteeio/rep1/rep2/example4.zip

mkdir -p ${PREPS_HOME}/${GIO_RELEASE_VERSION}/reporters/
mkdir -p ${PREPS_HOME}/${GIO_RELEASE_VERSION}/resources/
mkdir -p ${PREPS_HOME}/${GIO_RELEASE_VERSION}/repositories/
mkdir -p ${PREPS_HOME}/${GIO_RELEASE_VERSION}/fetchers/
mkdir -p ${PREPS_HOME}/${GIO_RELEASE_VERSION}/services/
mkdir -p ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/


touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/reporters/gravitee-reporter-file-1.5.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/reporters/gravitee-reporter-elasticsearch-1.25.15.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/resources/gravitee-resource-oauth2-provider-generic-1.13.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/resources/gravitee-resource-cache-1.2.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/resources/gravitee-resource-oauth2-provider-am-1.10.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/repositories/gravitee-repository-gateway-bridge-http-client-1.25.5.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/repositories/gravitee-repository-gateway-bridge-http-server-1.25.5.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/repositories/gravitee-repository-elasticsearch-1.25.15.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/repositories/gravitee-repository-jdbc-1.25.8.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/repositories/gravitee-repository-mongodb-1.25.7.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/fetchers/gravitee-fetcher-gitlab-1.9.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/fetchers/gravitee-fetcher-github-1.4.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/fetchers/gravitee-fetcher-http-1.10.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/fetchers/gravitee-fetcher-bitbucket-1.5.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/fetchers/gravitee-fetcher-git-1.6.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/services/gravitee-service-discovery-consul-1.1.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/services/gravitee-gateway-services-ratelimit-1.6.3.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-callout-http-1.7.1.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-keyless-1.2.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-oauth2-1.9.2.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-json-validation-1.1.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-ratelimit-1.6.3.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-openid-connect-userinfo-1.2.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-generate-jwt-1.1.4.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-cache-1.6.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-url-rewriting-1.1.1.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-json-to-json-1.3.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-override-http-method-1.1.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-jws-1.1.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-html-json-1.4.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-latency-1.1.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-transformqueryparams-1.3.2.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-mock-1.6.2.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-ipfiltering-1.3.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-request-validation-1.3.5.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-quota-1.6.3.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-role-based-access-control-1.0.1.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-xml-json-1.4.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-assign-attributes-1.1.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-dynamic-routing-1.5.4.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-groovy-1.9.2.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-request-content-limit-1.5.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-xslt-1.3.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-transformheaders-1.6.1.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-assign-content-1.4.0.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-jwt-1.13.1.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-rest-to-soap-1.4.1.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-resource-filtering-1.5.1.zip
touch ${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/gravitee-policy-apikey-1.8.0.zip

```
