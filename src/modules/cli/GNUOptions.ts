/*
Author (Copyright) 2020 <Jean-Baptiste-Lasselle>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

If your software can interact with users remotely through a computer
network, you should also make sure that it provides a way for users to
get its source.  For example, if your program is a web application, its
interface could display a "Source" link that leads users to an archive
of the code.  There are many ways you could offer source, and different
solutions will be better for different programs; see section 13 for the
specific requirements.

You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU AGPL, see
<https://www.gnu.org/licenses/>.
*/
import * as yargsLib from 'yargs';
// import yargs = require('yargs/yargs');

export class GNUOptions {

  public readonly argv;

  constructor(){

    let generation_options_desc = "\n\n" + `['v1'] All Gravitee APIM and Gravitee AM releases of source code version of the form '1.x.y', are of 'v1' Gravitee Generation. Refer to https://github.com/${process.env.GH_ORG}/gravitee-gateway and https://github.com/${process.env.GH_ORG}/gravitee-access-management to   `
    generation_options_desc += "\n\n" + `['v3'] designed to run the nexus staging in every the ${process.env.GH_ORG} product component git repo (dev git repos, aka repos where product source code is versioned).`
    generation_options_desc += "\n\n"

    let product_options_desc = "\n\n" +`['apim'] Gravitee APIM and Gravitee AM  designed to run in the [https://github.com/${process.env.GH_ORG}/release] ${process.env.GH_ORG} git repo, will run the maven release process, handling all dependency tree parallelization, with reactive behavior (using RxJS), based on the 'release.json' versioned in the https://github.com/${process.env.GH_ORG}/release git repository`
    product_options_desc += "\n\n" +`['am'] designed to run the nexus staging in every the ${process.env.GH_ORG} product component git repo (dev git repos, aka repos where product source code is versioned).`
    product_options_desc += "\n\n" +`['ae'] designed to run in every the ${process.env.GH_ORG} product component git repo (dev git repos, aka repos where product source code is versioned), to manage pull requests with different Circle CI Pipeline Workflows, for support sprints, dev sprints, or even secops sprints. , and based on git branch names (prefix).`
    product_options_desc += "\n\n" +`['cockpit'] designed to run in the [https://github.com/${process.env.GH_ORG}/docker-library] ${process.env.GH_ORG} git repo, to make bundles (something like tar arhcives, zip files of jars...) used to install many dependencies in Container images.`
    product_options_desc += "\n\n"

    this.argv = yargsLib.options({
      'with-ee': { type: 'boolean', default: true, desc: "\n\n" +"Use this option to run this taks for the Entreprise Edition as well.", alias: 'e' },
      'generation': { choices: ['v1', 'v2'], demandOption: true, desc: `Use this option to specify the Gravitee Generation (V1 or V3 for example). ${generation_options_desc}`, alias: 'g' },
      'product': { choices: ['apim', 'am',  'ae',  'cockpit'], demandOption: true, desc: `Use this option to specify the Gravitee Product. ${product_options_desc}`, alias: 'p' },
      /*,
      b: { type: 'string', demandOption: true },
      c: { type: 'number', alias: 'chill' },
      d: { type: 'array' },
      e: { type: 'count' },
      f: { choices: ['1', '2', '3'] }
      */
    }).argv;

    /// console.log(`valeur yargs de l'option YARGS 'dry-run' : ${this.argv["dry-run"]}`);
    /// console.log(`valeur yargs de l'option YARGS 'cicd-stage' : ${this.argv["cicd-stage"]}`);
  }
}

/// export const gnuOptions: GNUOptions = new GNUOptions();
