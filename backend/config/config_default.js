//
// GPS Development Configuration
//


//
// CONFIG
//

let jsonfile =require('jsonfile');                        // Reading and writing JSON files.
let secrets = jsonfile.readFileSync('../../secrets.json');

exports.secretResetKey = secrets.passwordReset;