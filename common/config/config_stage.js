//
// GPS Staging Configuration
//
// (only staging overrides should be put here)
//


//
// CONFIG
//


exports.path_prefix = '/trackcollector';

// Base URI for ALL backend services.
exports.base_uri = `${exports.path_prefix == '/' ? '' : exports.path_prefix}/api`;

// Frontend API prefix.
exports.paths_api_prefix = `https://test.goopti.com${exports.path_prefix == '/' ? '' : exports.path_prefix}/api`;

