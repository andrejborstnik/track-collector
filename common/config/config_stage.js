//
// GPS Staging Configuration
//
// (only staging overrides should be put here)
//


//
// CONFIG
//


// Base URI for ALL backend services.
exports.base_uri = `${exports.path_prefix == '/' ? '' : exports.path_prefix}/api`;

// Frontend API prefix.
exports.paths_api_prefix = `${exports.fe_url}${exports.path_prefix == '/' ? '' : exports.path_prefix}/api`;

