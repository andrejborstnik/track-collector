let jsonfile =require('jsonfile');                        // Reading and writing JSON files.
let localconf = jsonfile.readFileSync('../../local.config');

exports.fe_url = localconf.url;
exports.path_prefix = localconf.fe_path;

exports.url_prefix = `${exports.path_prefix == '/' ? '' : exports.path_prefix}`;

// Base URI for ALL backend services.
exports.base_uri = `${exports.path_prefix == '/' ? '' : exports.path_prefix}/api`;

// Frontend API prefix.
exports.paths_api_prefix = `${exports.fe_url}${exports.path_prefix == '/' ? '' : exports.path_prefix}/api`;