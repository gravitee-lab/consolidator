import { Preparator } from './modules/Preparator'
import { Consolidator } from './modules/Consolidator'

console.log('')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('  I am the Gravitee IO Bot  !')
console.log('  I will now conslidate the Folder / Files tree structure ')
console.log('  which will be published to https://download.gravitee.io ')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('')

let myConsolidator: Preparator = new Consolidator('APIM CE Consolidator');
myConsolidator.run("test executing");
