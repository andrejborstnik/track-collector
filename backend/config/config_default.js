//
// GPS Development Configuration
//


//
// CONFIG
//

let jsonfile =require('jsonfile');                        // Reading and writing JSON files.
let secrets = jsonfile.readFileSync('../../secrets.json');
let localconf = jsonfile.readFileSync('../../local.config');

exports.secretResetKey = secrets.passwordReset;
exports.java_be = localconf.java_be;
exports.java_be_path = localconf.be_path;