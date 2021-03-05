# How to use

```bash
# The absolute path to the folder where the Python Script put all the built zip files.
export PREPS_HOME=$(pwd)/tmp
#  the Gravitee release version
export GIO_RELEASE_VERSION="1.25.27"
# The absolute path to the folder where to prepare the folder / files tree structure to sync to the S3 Bucket
export BUCKET_CONTENT_HOME=$(pwd)/tests-bucket-content-home

npm start -- -g v1 -e false -p apim
```

## Re-implementation of

The `Consolidator` module, is a re-implementation of the following bash function :

```bash
prepareDownloadGioVprototype () {
  echo "# --->> [prepareDownloadGioVprototype () ]"
  # --- #
  # ${PREPS_HOME}/dist.gravitee.io/graviteeio-ee/apim/distributions/graviteeio-ee-full-${GIO_RELEASE_VERSION}.zip
  # PREPS_HOME=/home/circleci/project/tmp-ee
  find ${PREPS_HOME} -name '*.zip' -print | tee ./list.of.zip.files

  export NB_OF_LINES=$(cat -n  ./list.of.zip.files | awk '{print $1}' | tail -n 1)
  echo "# -------------------------------------------------------------------------------- #"
  echo "# --->> [prepareDownloadGioVprototype ()  ----------------------------------------------- #"
  echo "# -   here is the list of zip files which have to be prepared to be published :  - #"
  cat -n ./list.of.zip.files
  echo "# -          [${NB_OF_LINES}] zip files are going to be published                - #"
  echo "# -------------------------------------------------------------------------------- #"
  echo "# -------------------------------------------------------------------------------- #"
  # rm ./list.of.zip.files
  # /home/circleci/project/tmp-ee/dist.gravitee.io/graviteeio-ee/apim/distributions/graviteeio-ee-full-1.25.26.zip
  ## --- Filter ./list.of.zip.files
  ## reporters
  ## resources
  ## repositories
  ## fetchers
  ## services
  ## policies
  ## --
  # cat ./list.of.zip.files | grep "${PREPS_HOME}/dist.gravitee.io/" | tee ./filtered.list.of.zip.files
  echo "# --->> [prepareDownloadGioVprototype () main filter is : [${PREPS_HOME}/${GIO_RELEASE_VERSION}/dist/graviteeio]"
  if [ -f ./filtered.list.of.reporters.zip.files ]; then
    rm ./filtered.list.of.reporters.zip.files
  fi;
  if [ -f ./filtered.list.of.resources.zip.files ]; then
    rm ./filtered.list.of.resources.zip.files
  fi;
  if [ -f ./filtered.list.of.repositories.zip.files ]; then
    rm ./filtered.list.of.repositories.zip.files
  fi;
  if [ -f ./filtered.list.of.fetchers.zip.files ]; then
    rm ./filtered.list.of.fetchers.zip.files
  fi;
  if [ -f ./filtered.list.of.services.zip.files ]; then
    rm ./filtered.list.of.services.zip.files
  fi;
  if [ -f ./filtered.list.of.policies.zip.files ]; then
    rm ./filtered.list.of.policies.zip.files
  fi;
  echo ""
  echo "# --->> [prepareDownloadGioVprototype () list files in DIST = [${PREPS_HOME}/${GIO_RELEASE_VERSION}/dist/] "
  echo ""
  ls -allh ${PREPS_HOME}/${GIO_RELEASE_VERSION}/dist/
  echo ""
  echo "# --->> [prepareDownloadGioVprototype () generate filter files "
  echo ""
  cat ./list.of.zip.files | grep "${PREPS_HOME}/${GIO_RELEASE_VERSION}/reporters/" | tee -a ./filtered.list.of.reporters.zip.files
  cat ./list.of.zip.files | grep "${PREPS_HOME}/${GIO_RELEASE_VERSION}/resources/" | tee -a ./filtered.list.of.resources.zip.files
  cat ./list.of.zip.files | grep "${PREPS_HOME}/${GIO_RELEASE_VERSION}/repositories/" | tee -a ./filtered.list.of.repositories.zip.files
  cat ./list.of.zip.files | grep "${PREPS_HOME}/${GIO_RELEASE_VERSION}/fetchers/" | tee -a ./filtered.list.of.fetchers.zip.files
  cat ./list.of.zip.files | grep "${PREPS_HOME}/${GIO_RELEASE_VERSION}/services/" | tee -a ./filtered.list.of.services.zip.files
  cat ./list.of.zip.files | grep "${PREPS_HOME}/${GIO_RELEASE_VERSION}/policies/" | tee -a ./filtered.list.of.policies.zip.files



  declare -a GioTypesArray=("reporters" "resources" "repositories" "fetchers" "services" "policies" )

  # Iterate the string array using for loop
  for GIO_TYPE in ${GioTypesArray[@]}; do

    echo "# ------------------------------------------------------------->> "
    echo "# ------------------------------------------------------------->> "
    echo "# ------------------------------------------------------------->> "
    echo "# --->> [prepareDownloadGioVprototype () List of ZIP of Type [GIO_TYPE=[${GIO_TYPE}]]]"
    echo "# ------------------------------------------------------------->> "
    cat ./filtered.list.of.$GIO_TYPE.zip.files
    echo "# ------------------------------------------------------------->> "
    echo "# ------------------------------------------------------------->> "
    while read ZIP_FILE_PATH; do
      echo "# --->> [prepareDownloadGioVprototype () [GIO_TYPE=[${GIO_TYPE}]]] preparing ${ZIP_FILE_PATH}"
      export INCONTAINER_FULLPATH=$(echo "${ZIP_FILE_PATH}" | sed "s#$PWD/#\.\/#g")
      export ZIP_FILENAME=$(echo "${ZIP_FILE_PATH}" | awk -F '/' '{print $NF}')
      export BIT_TO_STRIP=$(echo "${ZIP_FILENAME}" | sed "s#\.zip##g"  | awk -F '-' '{print $NF}')
      export ZIP_FILENAME_NOEXT_NOVER=$(echo "${ZIP_FILENAME}" | sed "s#\.zip##g"  | awk -F "-${BIT_TO_STRIP}" '{print $1}')
      export INCONTAINER_PATH=$(echo "${INCONTAINER_FULLPATH}" | sed "s#${ZIP_FILENAME}##g")
      echo "# --->> [prepareDownloadGioVprototype () [GIO_TYPE=[${GIO_TYPE}]]] Now checksuming [${ZIP_FILENAME}]"
      echo "# --->> [prepareDownloadGioVprototype () [GIO_TYPE=[${GIO_TYPE}]]] INCONTAINER_PATH=[${INCONTAINER_PATH}]"
      echo "# --->> [prepareDownloadGioVprototype () [GIO_TYPE=[${GIO_TYPE}]]] ZIP_FILENAME=[${ZIP_FILENAME}]"
      docker run --name checksummer -i --rm -v $PWD:/root/ debian:buster-slim bash -c "cd /root && cd ${INCONTAINER_PATH} && sha512sum ${ZIP_FILENAME} > ${ZIP_FILENAME}.sha512sum && md5sum ${ZIP_FILENAME} > ${ZIP_FILENAME}.md5" || true
      export DESTINATION_FOLDER=graviteeio-apim/plugins/${GIO_TYPE}/${ZIP_FILENAME_NOEXT_NOVER}/
      echo "# --->> [prepareDownloadGioVprototype () [GIO_TYPE=[${GIO_TYPE}]]] ZIP_FILE_PATH=[${ZIP_FILE_PATH}]"
      echo "# --->> [prepareDownloadGioVprototype () [GIO_TYPE=[${GIO_TYPE}]]] ZIP_FILENAME=[${ZIP_FILENAME}]"
      echo "# --->> [prepareDownloadGioVprototype () [GIO_TYPE=[${GIO_TYPE}]]] DESTINATION_FOLDER=[${DESTINATION_FOLDER}]"
      mkdir -p ${BUCKET_CONTENT_HOME}/bucket-content/${DESTINATION_FOLDER}
      echo "# --->> [prepareDownloadGioVprototype () [GIO_TYPE=[${GIO_TYPE}]]] cp ${ZIP_FILE_PATH} ${BUCKET_CONTENT_HOME}/bucket-content/${DESTINATION_FOLDER}"
      cp -f ${ZIP_FILE_PATH} ${BUCKET_CONTENT_HOME}/bucket-content/${DESTINATION_FOLDER}/
      echo "# --->> [prepareDownloadGioVprototype () [GIO_TYPE=[${GIO_TYPE}]]] cp ${ZIP_FILE_PATH}.md5 ${BUCKET_CONTENT_HOME}/bucket-content/${DESTINATION_FOLDER}"
      cp -f ${ZIP_FILE_PATH}.md5 ${BUCKET_CONTENT_HOME}/bucket-content/${DESTINATION_FOLDER}/
      echo "# --->> [prepareDownloadGioVprototype () [GIO_TYPE=[${GIO_TYPE}]]] cp ${ZIP_FILE_PATH}.sha512sum ${BUCKET_CONTENT_HOME}/bucket-content/${DESTINATION_FOLDER}"
      cp -f ${ZIP_FILE_PATH}.sha512sum ${BUCKET_CONTENT_HOME}/bucket-content/${DESTINATION_FOLDER}/
    done <./filtered.list.of.$GIO_TYPE.zip.files
  done

}

```

Therefore, executing this function requires 2 Environment Variables to be set :

* `PREPS_HOME`: The absolute path to the folder where the Python Script put all the built zip files.
* `GIO_RELEASE_VERSION` : the Gravitee release version
* `BUCKET_CONTENT_HOME` : The absolute path to the folder where to prepare the folder / files tree structure to sync to the S3 Bucket


# Tests data

When running tests, generate the following tree structure to run a first test :

* test data set 1 :
```bash
# The absolute path to the folder where the Python Script put all the built zip files.
export PREPS_HOME=$(pwd)/tmp
#  the Gravitee release version
export GIO_RELEASE_VERSION="1.25.27"


mkdir  -p ${PREPS_HOME}/rep1/rep2/rep3
touch ${PREPS_HOME}/example1.zip
touch ${PREPS_HOME}/rep1/example2.zip
touch ${PREPS_HOME}/rep1/rep2/example3.zip
touch ${PREPS_HOME}/rep1/rep2/example4.zip
```


* test data set 2 :

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
