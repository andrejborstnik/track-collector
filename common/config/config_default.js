//
// GPS Development Configuration
//


//
// CONFIG
//


// Backend port.
exports.be_port = 3102;

// Frontend port.
exports.fe_port = 3002;

// Browsersync port.
exports.port = 4080;

// Build destination.
exports.build_dest = "build";

// Main application name.
exports.app_name = "GPS";

// Main application title.
exports.app_title = "GPS";

// Winston verbosity level.
exports.log_level = 'debug';

// Base URI for ALL backend services.
exports.base_uri = '/api';

// Backend API prefix.
exports.paths_api_prefix = `http://localhost:${exports.be_port}/api`;


// Babel.
exports.babel = {
    "presets": ["es2015"],
    "plugins": ["transform-runtime"]
};

// Bing api key
exports.bing_key = "Ag6kChdDWwxxcllA1_-GIHV67Fsux7SYWs8Mk5LOL7s4qJC4z3u5Nf567MYgDwm3";

