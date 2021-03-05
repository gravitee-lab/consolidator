import * as shelljs from 'shelljs';
import * as fs from 'fs';
import { Preparator } from '../../../Preparator';

/**************************************************/
/*    Env. Variables used in the Circle CI Orb :  */
/*                                                */
/*    - PREPS_HOME                                */
/*    - GIO_RELEASE_VERSION                       */
/*    - BUCKET_CONTENT_HOME                       */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/*                                                */
/**************************************************/


export class ApimV1CePreparator implements Preparator {
    name: String;
    constructor(name: String) {
        this.name = name;
    }

    run(arg: any): void {
        console.log(`running: ${this.name}, arg: ${arg}`);
    }
}

/** Usage :
let myApimV1CePreparator: Preparator = new ApimV1CePreparator('APIM V1 Community Edition Prepare Download Task');
myApimV1CePreparator.run("test");
*/
