//
// Application Configuration
//


//
// LIBRARIES
//


const objectAssign = require('object-assign');


//
// CONST
//


// Node path for modules resolving.
process.env.NODE_PATH = process.env.NODE_FRONTEND_PATH;


//
// MAIN
//


// Merged and exported configuration. Take note that production configuration overrides
// the development settings when 'in production'.

const _config = {};

// Load default configuration parameters
objectAssign(_config, require('../common/config/config_default'));
objectAssign(_config, require('config/config_default'));

// Mode specific configuration overrides
if (process.env.__MODE__ === 'DEV') {
    // Already loaded
}
else if (process.env.__MODE__ === 'STAGE') {
    objectAssign(_config, require('../common/config/config_stage'));
    objectAssign(_config, require('config/config_stage'));
}
else if (process.env.__MODE__ === 'PROD') {
    objectAssign(_config, require('../common/config/config_prod'));
    objectAssign(_config, require('config/config_prod'));
    process.env.NODE_ENV = 'production';
}
else if (process.env.__MODE__ === 'TEST') {
    objectAssign(_config, require('../common/config/config_test'));
    objectAssign(_config, require('config/config_test'));
}

// Expose mode to backend and frontend.
_config.__MODE__ = process.env.__MODE__;

// Define which environment modes count as development mode for frontend.
_config.IS_DEV_MODE = (process.env.__MODE__ == 'DEV' || process.env.__MODE__ == 'STAGE' || process.env.__MODE__ == 'TEST');

module.exports = _config;
