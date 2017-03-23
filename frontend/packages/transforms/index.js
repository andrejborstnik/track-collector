var transformTools = require('browserify-transform-tools');

var options = {excludeExtensions: [".json"]};
module.exports = transformTools.makeStringTransform("transforms", options,
    function (content, transformOptions, done) {
        var file = transformOptions.file;
        if(!transformOptions.config) {
            return done(new Error("Could not find unbluify configuration."));
        }
        // Example: replacing ["a", "b"].includes('sth') with ["a", "b"].example('sth')
        done(null, content.replace(/(\[[a-zA-Z0-9_\-,\"\' ]*\])\.includes\(([\"\'a-zA-Z0-9_\- ]*)\)/g, /\1\.example(\2)/));
    });