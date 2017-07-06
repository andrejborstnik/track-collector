//
// GPS Development Configuration
//


//
// CONFIG
//


let jsonfile =require('jsonfile');                        // Reading and writing JSON files.
let localconf = jsonfile.readFileSync('../../local.config');

exports.fe_url = localconf.url;
exports.path_prefix = localconf.fe_path;

// SASS.
exports.paths_sass = [
    "node_modules/foundation-sites/scss",
    "node_modules",
    "src"
];

// The collection of node modules and their files to be exported to vendor build directory.
exports.node_vendor_modules = {
    "bowser" : ["bowser.min.js"],
    "jquery" : ["dist/jquery.min.js"],
    "foundation-sites": ["dist/css/foundation.css"],
    "vuetify": ["dist/vuetify.min.css"]
};


// Frontend application.
exports.main_application_file = "frontend.js";
