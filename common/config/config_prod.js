//
// GPS Production Configuration
//
// (only production overrides should be put here)
//


//
// CONFIG
//

exports.url_prefix = `${exports.path_prefix == '/' ? '' : exports.path_prefix}`;

// Base URI for ALL backend services.
exports.base_uri = `${exports.path_prefix == '/' ? '' : exports.path_prefix}/api`;

// Frontend API prefix.
exports.paths_api_prefix = `${exports.fe_url}${exports.path_prefix == '/' ? '' : exports.path_prefix}/api`;
