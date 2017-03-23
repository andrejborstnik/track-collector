//
// IOW Development Configuration
//


//
// CONFIG
//


// SASS.
exports.paths_sass = [
    "node_modules/foundation-sites/scss",
    "node_modules",
    "src"
];

// The collection of node modules and their files to be exported to vendor build directory.
exports.node_vendor_modules = {
    "bowser" : ["bowser.min.js"],
    "jquery" : ["dist/jquery.min.js"]
};


// Frontend application.
exports.main_application_file = "frontend.js";

