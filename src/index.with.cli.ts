import { Cli } from './modules/cli/Cli';
import { Preparator } from './modules/Preparator'
import { Consolidator } from './modules/Consolidator'

console.log('')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('  I am the Gravitee IO Bot  !')
console.log('  I will now conslidate the Folder / Files tree structure ')
console.log('  which will be published to https://download.gravitee.io ')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('')

/// throw new Error("DEBUG STOP POINT")

export const cli : Cli = new Cli();

console.log(`{[ index.ts ]} --- valeur yargs de l'option YARGS 'with-ee' : ${cli.gnuOptions.argv["with-ee"]}`);
console.log(`{[ index.ts ]} --- valeur yargs de l'option YARGS 'product' : ${cli.gnuOptions.argv.product}`);
console.log(`{[ index.ts ]} --- valeur yargs de l'option YARGS 'generation' : ${cli.gnuOptions.argv.generation}`);

// process.argv = cli.gnuOptions.argv;
cli.gnuOptions.argv['with-ee']
cli.gnuOptions.argv.product
cli.gnuOptions.argv.generation

// const withEE = process.env.WITH_EE;


// const prepsHome = process.env.PREPS_HOME
// const gioReleaseVersion = process.env.GIO_RELEASE_VERSION
/* Ok run it now */
let myConsolidator: Preparator = new Consolidator('APIM CE Consolidator');
myConsolidator.run("test executing");
