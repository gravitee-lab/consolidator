import * as shelljs from 'shelljs';
import * as fs from 'fs';
import { Preparator } from '../../../Preparator';

/**************************************************/
/*    Env. Variables used in the Circle CI Orb :  */
/*                                                */
/*    - CCCC                                      */
/*    - CCCC                                      */
/*    - CCCC                                      */
/*    - CCCC                                      */
/*    - CCCC                                      */
/*    - CCCC                                      */
/*    - CCCC                                      */
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


export class ApimV1EePreparator implements Preparator {
    name: String;
    constructor(name: String) {
        this.name = name;
    }

    run(arg: any): void {
        console.log(`running: ${this.name}, arg: ${arg}`);
    }
}

/** Usage :
let myApimV1EePreparator: Preparator = new ApimV1EePreparator('APIM V1 Community Edition Prepare Download Task');
myApimV1EePreparator.run("test");
*/
