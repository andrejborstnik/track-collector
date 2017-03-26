//
// Application Configuration
//


//
// LIBRARIES
//


//
// CONST
//


// Node path for modules resolving.
process.env.NODE_PATH = process.env.NODE_BACKEND_PATH;


//
// MAIN
//


// Merged and exported configuration. Take note that production configuration overrides
// the development settings when 'in production'.

const _config = {};

// Load default configuration parameters
Object.assign(_config, require('../common/config/config_default'));
Object.assign(_config, require('config/config_default'));

// Mode specific configuration overrides
if (process.env.__MODE__ === 'DEV') {
    // Already loaded
}
else if (process.env.__MODE__ === 'STAGE') {
    Object.assign(_config, require('../common/config/config_stage'));
    Object.assign(_config, require('config/config_stage'));
}
else if (process.env.__MODE__ === 'PROD') {
    Object.assign(_config, require('../common/config/config_prod'));
    Object.assign(_config, require('config/config_prod'));
    process.env.NODE_ENV = 'production';
}
else if (process.env.__MODE__ === 'TEST') {
    Object.assign(_config, require('../common/config/config_test'));
    Object.assign(_config, require('config/config_test'));
}

// Expose mode to backend and frontend.
_config.__MODE__ = process.env.__MODE__;

// Define which environment modes count as development mode for frontend.
_config.IS_DEV_MODE = (process.env.__MODE__ == 'DEV' || process.env.__MODE__ == 'STAGE' || process.env.__MODE__ == 'TEST');

module.exports = _config;
