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

exports.path_prefix = localconf.fe_path;
exports.java_be = localconf.java_be;
exports.java_be_path = localconf.be_path;
exports.be_port = localconf.be_port;
exports.fe_port = localconf.fe_port;

exports.url_prefix = `${exports.path_prefix == '/' ? '' : exports.path_prefix}`;

// Base URI for ALL backend services.
exports.base_uri = `${exports.path_prefix == '/' ? '' : exports.path_prefix}/api`;

// Backend API prefix.
exports.paths_api_prefix = `http://localhost:${exports.be_port}${exports.path_prefix == '/' ? '' : exports.path_prefix}/api`;