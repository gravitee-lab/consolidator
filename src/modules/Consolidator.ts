import { Preparator } from './Preparator'
import * as shelljs from 'shelljs';
import * as fs from 'fs';

export class Consolidator implements Preparator{
    name: String;
    opsHome: String;
    gioBundlesTypes: String[] = [ `reporters`, `resources`, `repositories`, `fetchers`, `services`, `policies` ];
    zipFilesBom: any = {};

    constructor(name: String) {
        this.name = name;

        let evaluatePWD = shelljs.exec(`pwd`);
        if (evaluatePWD.code !== 0) {
          // throw new Error(`{[Consolidator]} - An error occured while evaluating PWD`)
        }
        this.opsHome = evaluatePWD.stdout.trim();

    }

    run(arg: any): void {
        if (`${process.env.PREPS_HOME}` === `` || process.env.PREPS_HOME === undefined) {
          throw new Error(`The PREPS_HOME environment variable is not set, but is required.`);
        }
        if (`${process.env.GIO_RELEASE_VERSION}` === `` || process.env.GIO_RELEASE_VERSION === undefined) {
          throw new Error(`The GIO_RELEASE_VERSION environment variable is not set, but is required.`);
        }
        if (`${process.env.BUCKET_CONTENT_HOME}` === `` || process.env.BUCKET_CONTENT_HOME === undefined) {
          throw new Error(`The BUCKET_CONTENT_HOME environment variable is not set, but is required.`);
        }
        console.log(`# --------------------------------------- {[Consolidator]} --------------------------------------- # `);
        console.log(`# ------------------------------------------------------------------------------------------------ # `);
        console.log(`#                                                                                                  # `);
        console.log(`running: [${this.name}]`);
        console.log(`with OPS_HOME: [${this.opsHome}]`);
        console.log(`with PREPS_HOME: [${process.env.PREPS_HOME}]`);
        console.log(`with GIO_RELEASE_VERSION: [${process.env.GIO_RELEASE_VERSION}]`);
        console.log(`with BUCKET_CONTENT_HOME: [${process.env.BUCKET_CONTENT_HOME}]`);
        console.log(`with provided argument:`);
        console.log(arg);
        console.log(`#                                                                                                  # `);
        console.log(`# ------------------------------------------------------------------------------------------------ # `);
        console.log(`# --------------------------------------- {[Consolidator]} --------------------------------------- # `);
        // process.env.PREPS_HOME
        // process.env.GIO_RELEASE_VERSION

        if (`${process.env.PREPS_HOME}` === `` || process.env.PREPS_HOME === undefined) {
          throw new Error(`The PREPS_HOME environment variable is not set, but is required.`);
        } else {
          console.log(` empty PREPS_HOME not found PREPS_HOME=[${process.env.PREPS_HOME}] `)
        }
        if (`${process.env.GIO_RELEASE_VERSION}` === `` || process.env.GIO_RELEASE_VERSION === undefined) {
          throw new Error(`The GIO_RELEASE_VERSION environment variable is not set, but is required.`);
        } else {
          console.log(` empty GIO_RELEASE_VERSION not found GIO_RELEASE_VERSION=[${process.env.GIO_RELEASE_VERSION}] `)
        }

        this.scanZips();
        this.setUpFilters();
        this.processByFilters();
    }
    scanZips (): void {

      let findZips = shelljs.exec(`find ${process.env.PREPS_HOME} -name '*.zip' -print | tee "${this.opsHome}/list.of.zip.files"`);
      if (findZips.code !== 0) {
        throw new Error(`{[Consolidator]} - [scanZips(): void] - An Error occurred executing the [find ${process.env.PREPS_HOME} -name '*.zip' -print | tee ${this.opsHome}/list.of.zip.files] shell command. Shell error was [` + findZips.stderr + "] ")
      } else {
        let findZipsCmdStdOUT: string = findZips.stdout;
        findZipsCmdStdOUT = findZipsCmdStdOUT.trim();
        console.log(`{[Consolidator]} - [scanZips(): void] -  Here is the STDOUT of the [find ${process.env.PREPS_HOME} -name '*.zip' -print | tee ${this.opsHome}/list.of.zip.files] shell command : `)
        console.log(findZipsCmdStdOUT);
      }


      let countZips = shelljs.exec(`cat -n  ${this.opsHome}/list.of.zip.files | awk '{print $1}' | tail -n 1`);
      if (countZips.code !== 0) {
        throw new Error(`{[Consolidator]} - [scanZips(): void] - An Error occurred executing the [cat -n  ${this.opsHome}/list.of.zip.files | awk '{print $1}' | tail -n 1] shell command. Shell error was [` + countZips.stderr + "] ")
      }
      let nbOfZipFiles = countZips.stdout.trim();
      if (`${nbOfZipFiles}` === ``) {
        nbOfZipFiles = `0`;
      }
      console.log(`# -------------------------------------------------------------------------------- #`)
      console.log(`# -   here is the list of zip files which have to be prepared to be published :  - #`)
      console.log(`# -------------------------------------------------------------------------------- #`)
      console.log(`# -          [${nbOfZipFiles}] zip files are going to be published                - #`)
      let listZips = shelljs.exec(`cat -n  ${this.opsHome}/list.of.zip.files`);
      if (listZips.code !== 0) {
        throw new Error(`{[Consolidator]} - [scanZips(): void] - An Error occurred executing the [cat -n  ${this.opsHome}/list.of.zip.files] shell command. Shell error was [` + listZips.stderr + "] ")
      }
      console.log(``)
      console.log(`${countZips.stdout}`)
      console.log(``)
      console.log(`# -------------------------------------------------------------------------------- #`)
      console.log(`# -------------------------------------------------------------------------------- #`)
    }

    setUpFilters (): void {
      console.log(`# -------------------------------------------------------------------------------- #`)
      console.log(`{[Consolidator]} - [setUpFilters(): void] - main filter is : [${process.env.PREPS_HOME}/${process.env.GIO_RELEASE_VERSION}/dist/graviteeio]`)
      console.log(`# -------------------------------------------------------------------------------- #`)
      console.log(`# ----------- Clean up filters`)

      for (let k: number = 0; k < this.gioBundlesTypes.length; k++) {
        console.log(`# ----------- Executing : `)
        console.log(`if [ -f ${this.opsHome}/filtered.list.of.${this.gioBundlesTypes[k]}.zip.files ]; then   rm ${this.opsHome}/filtered.list.of.${this.gioBundlesTypes[k]}.zip.files; fi`)
        console.log(`# ----------- `)
        let cleanFilters = shelljs.exec(`if [ -f ${this.opsHome}/filtered.list.of.${this.gioBundlesTypes[k]}.zip.files ]; then   rm ${this.opsHome}/filtered.list.of.${this.gioBundlesTypes[k]}.zip.files; fi`);
        if (cleanFilters.code !== 0) {
          throw new Error(`{[Consolidator]} - [setUpFilters(): void] - An Error occurred executing the [if [ -f ${this.opsHome}/filtered.list.of.${this.gioBundlesTypes[k]}.zip.files ]; then   rm ${this.opsHome}/filtered.list.of.${this.gioBundlesTypes[k]}.zip.files; fi] shell command. Shell error was [` + cleanFilters.stderr + "] ")
        }
      }

      console.log(`# -------------------------------------------------------------------------------- #`)
      console.log(``)
      console.log(`# -------------------------------------------------------------------------------- #`)
      console.log(`# ----------- generate Filters`)
      console.log(``)
      let listFilesInDist = shelljs.exec(`ls -allh ${process.env.PREPS_HOME}/${process.env.GIO_RELEASE_VERSION}/dist/`);
      if (listFilesInDist.code !== 0) {
        throw new Error(`{[Consolidator]} - [setUpFilters(): void] - An Error occurred executing the [ls -allh ${process.env.PREPS_HOME}/${process.env.GIO_RELEASE_VERSION}/dist/] shell command. Shell error was [` + listFilesInDist.stderr + "] ")
      }

      for (let k: number = 0; k < this.gioBundlesTypes.length; k++) {
        console.log(`# ------------------------------------------------------------->> `)
        console.log(`# --->> generating Filter File for Bundle Type GIO_TYPE=[${this.gioBundlesTypes[k]}]`)
        console.log(`# ------------------------------------------------------------->> `)
        console.log(``)
        let generateFilterFile = shelljs.exec(`cat ${this.opsHome}/list.of.zip.files | grep "${process.env.PREPS_HOME}/${process.env.GIO_RELEASE_VERSION}/${this.gioBundlesTypes[k]}/" | tee -a  ${this.opsHome}/filtered.list.of.${this.gioBundlesTypes[k]}.zip.files`);
        if (generateFilterFile.code !== 0) {
          throw new Error(`{[Consolidator]} - [setUpFilters(): void] - An Error occurred executing the [cat ${this.opsHome}/filtered.list.of.${this.gioBundlesTypes[k]}.zip.files] shell command. Shell error was [` + generateFilterFile.stderr + "] ")
        }
        console.log(``)
        console.log(`# ------------------------------------------------------------->> `)
      }
      console.log(``)
      console.log(`# -------------------------------------------------------------------------------- #`)

    }


    processByFilters (): void {
      console.log(``)
      console.log(`# -------------------------------------------------------------------------------- #`)
      console.log(`# ----------- {[Consolidator]} - [processByFilters(): void] - `)
      console.log(`# -------------------------------------------------------------------------------- #`)
      console.log(``)
      for (let k: number = 0; k < this.gioBundlesTypes.length; k++) {
        let filterFilePath: String = `${this.opsHome}/filtered.list.of.${this.gioBundlesTypes[k]}.zip.files`;
        console.log(``);
        console.log(`start processing [${filterFilePath}]`);
        let gioBundlesTypes: string = `${this.gioBundlesTypes[k]}`;
        let gioOpsHome: string = `${this.opsHome}`;

        fs.readFileSync(`${filterFilePath}`).toString().split("\n").forEach(function(line, index, arr) {
          if (index === arr.length - 1 && line === "") { return; }
          console.log(``);

          let evaluatePWD = shelljs.exec(`pwd`);
          if (evaluatePWD.code !== 0) {
            throw new Error(`{[Consolidator]} - [processByFilters(): void] - An error occured while evaluating PWD`)
          }
          let curentPWD = evaluatePWD.stdout.trim();

          let zipFilePath: string = line;
          console.log("{[Consolidator]} - [processByFilters(): void] - line number " + index + " filePath is : [" + zipFilePath + "]");
          let zipFilePathSplit: string[] = zipFilePath.split('/')
          let zipFileName: string = zipFilePathSplit[zipFilePathSplit.length - 1]; // export ZIP_FILENAME=$(echo "${ZIP_FILE_PATH}" | awk -F '/' '{print $NF}')
          let zipFileDir: string = zipFilePath.replace(`${zipFileName}`, ``);
          let incontainerFullpath: string = zipFilePath.replace(`${curentPWD}/`, "./"); // export INCONTAINER_FULLPATH=$(echo "${ZIP_FILE_PATH}" | sed "s#$PWD/#\.\/#g")

          let bitToStripSplit: string[] = zipFileName.replace(`.zip`, ``).split('-');
          let bitToStrip: string = bitToStripSplit[bitToStripSplit.length - 1]; // export BIT_TO_STRIP=$(echo "${ZIP_FILENAME}" | sed "s#\.zip##g"  | awk -F '-' '{print $NF}')

          let zipFilenameNoextNover: string = zipFileName.replace(`.zip`, ``).split(`-${bitToStrip}`)[0]; // export ZIP_FILENAME_NOEXT_NOVER=$(echo "${ZIP_FILENAME}" | sed "s#\.zip##g"  | awk -F "-${BIT_TO_STRIP}" '{print $1}')

          console.log(`{[Consolidator]} - [processByFilters(): void] - CHECK zipFileName=[${zipFileName}]`);
          console.log(`{[Consolidator]} - [processByFilters(): void] - CHECK zipFileDir=[${zipFileDir}]`);
          console.log(`{[Consolidator]} - [processByFilters(): void] - CHECK incontainerFullpath=[${incontainerFullpath}]`);
          console.log(`{[Consolidator]} - [processByFilters(): void] - CHECK bitToStrip=[${bitToStrip}]`);
          console.log(`{[Consolidator]} - [processByFilters(): void] - CHECK zipFilenameNoextNover=[${zipFilenameNoextNover}]`);


          console.log(``);
          console.log(`Now checksuming the file : `);
          console.log(``);
          console.log(`cd ${zipFileDir} && sha512sum ${zipFileName} > ${zipFileName}.sha512sum && md5sum ${zipFileName} > ${zipFileName}.md5 && cd ${gioOpsHome}`);
          console.log(``);
          let executeChecksummer = shelljs.exec(`cd ${zipFileDir} && sha512sum ${zipFileName} > ${zipFileName}.sha512sum && md5sum ${zipFileName} > ${zipFileName}.md5 && cd ${gioOpsHome}`);
          if (executeChecksummer.code !== 0) {
            throw new Error(`{[Consolidator]} - [processByFilters(): void] - An error occured while executing [cd ${zipFileDir} && sha512sum ${zipFileName} > ${zipFileName}.sha512sum && md5sum ${zipFileName} > ${zipFileName}.md5 && cd ${gioOpsHome}]`)
          }
          /*
          let executeChecksummer = shelljs.exec(`docker run --name checksummer -i --rm -v $PWD:/root/ debian:buster-slim bash -c "cd /root && cd ${incontainerFullpath} && sha512sum ${zipFileName} > ${zipFileName}.sha512sum && md5sum ${zipFileName} > ${zipFileName}.md5" || true`);
          if (executeChecksummer.code !== 0) {
            throw new Error(`{[Consolidator]} - [processByFilters(): void] - An error occured while executing [docker run --name checksummer -i --rm -v $PWD:/root/ debian:buster-slim bash -c "cd /root && cd ${incontainerFullpath} && sha512sum ${zipFileName} > ${zipFileName}.sha512sum && md5sum ${zipFileName} > ${zipFileName}.md5" || true]`)
          }
          */

          let destinationFolder: string =`graviteeio-apim/plugins/${gioBundlesTypes}/${zipFilenameNoextNover}`
          // mkdir -p ${BUCKET_CONTENT_HOME}/bucket-content/${DESTINATION_FOLDER}
          let createDestinationFolder = shelljs.exec(`mkdir -p ${process.env.BUCKET_CONTENT_HOME}/bucket-content/${destinationFolder}`);
          if (createDestinationFolder.code !== 0) {
            throw new Error(`{[Consolidator]} - [processByFilters(): void] - An error occured while executing [mkdir -p ${process.env.BUCKET_CONTENT_HOME}/bucket-content/${destinationFolder}]`)
          }
          console.log(``);
          console.log(`Now copying the file into the destination tree : `);
          console.log(` - destinationFolder=[${process.env.BUCKET_CONTENT_HOME}/bucket-content/${destinationFolder}] : `);
          // console.log(` - destinationFolder=[${process.env.BUCKET_CONTENT_HOME}/bucket-content/${destinationFolder}] : `);
          console.log(``);
          let copyZipFile = shelljs.exec(`cp -f ${zipFilePath} ${process.env.BUCKET_CONTENT_HOME}/bucket-content/${destinationFolder}/`); // cp -f ${ZIP_FILE_PATH} ${BUCKET_CONTENT_HOME}/bucket-content/${DESTINATION_FOLDER}/
          if (copyZipFile.code !== 0) {
            throw new Error(`{[Consolidator]} - [processByFilters(): void] - An error occured while executing [cp -f ${zipFilePath} ${process.env.BUCKET_CONTENT_HOME}/bucket-content/${destinationFolder}/]`)
          }
          let copyZipFileMD5 = shelljs.exec(`cp -f ${zipFilePath}.md5 ${process.env.BUCKET_CONTENT_HOME}/bucket-content/${destinationFolder}/`);
          if (copyZipFileMD5.code !== 0) {
            throw new Error(`{[Consolidator]} - [processByFilters(): void] - An error occured while executing [cp -f ${zipFilePath} ${process.env.BUCKET_CONTENT_HOME}/bucket-content/${destinationFolder}/]`)
          }
          let copyZipFileSHA = shelljs.exec(`cp -f ${zipFilePath}.sha512sum ${process.env.BUCKET_CONTENT_HOME}/bucket-content/${destinationFolder}/`);
          if (copyZipFileSHA.code !== 0) {
            throw new Error(`{[Consolidator]} - [processByFilters(): void] - An error occured while executing [cp -f ${zipFilePath} ${process.env.BUCKET_CONTENT_HOME}/bucket-content/${destinationFolder}/]`)
          }
          console.log(``);
        });
        console.log(`finished processing [${filterFilePath}]`);
        console.log(``);
      }


    }
}
