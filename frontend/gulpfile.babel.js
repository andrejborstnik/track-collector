//
// BUILDER
//


'use strict';


//
// LIBRARIES
//


// Import application config.
import * as config from 'config';                       // Global app configuration.
import del from 'del';                                  // Removing files.

// Gulp (building system)
import gulp from 'gulp';                                // Building system.
import runSequence from 'run-sequence';                 // Run sequence of tasks.
import MergeStream from 'merge-stream';                 // Merge gulp streams.
import gutil from 'gulp-util';                          // Logs
import concat from 'gulp-concat';                       // Concatenate files.
import rename from 'gulp-rename';                       // Rename file.
import replace from 'gulp-replace';                     // String replacing.
import notify from 'gulp-notify';                       // GUI notifications for gulp.
import notifier from 'node-notifier';                   // GUI notifications.
import uglify from 'gulp-uglify';                       // Minification.
import taskListing from 'gulp-task-listing';            // List all tasks.
import modifyFile from 'gulp-modify-file';              // Modifies file
import sass from 'gulp-sass';                           // Import sass.
import importOnce from 'node-sass-import-once';         // Import the imports only once in sass.
import purge from 'gulp-css-purge';                     // Purging css of duplicates.
import size from 'gulp-size';                           // Stream size.
import gulpif from 'gulp-if';                           // Conditional streams.
import watch from 'gulp-watch';                         // Fast chokidar style watcher.
import through2 from 'through2';                        // Simple node streams wrapper.
import jsonfile from 'jsonfile';                        // Reading and writing JSON files.

import browserSync from 'browser-sync';                 // Live reloading of frontend.
import serverFactory from 'spa-server';                 // Frontend static server.
import hmr from 'browserify-hmr';                       // Hot module replacement.

import history from 'connect-history-api-fallback';     // HTML5 pushstate middleware for browserSync.

import watchify from 'watchify';                        // Faster rebundling.
import browserify from 'browserify';                    // Web sources bundler.
import configurify from 'configurify';                  // Dynamic configuration.
import envify from 'envify/custom';                     // Replace specific variables in the browserify output.
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import babelify from 'babelify';                        // ES6 support.
import * as _ from 'lodash';                            // Lodash.
import clone from 'clone';                              // Deep cloning.

// Disc main.min.js visualisation.
import disc from 'disc';                                // Module usage analyser.
import opener from 'opener';                            // Opening files in browser.
import fs from 'fs';                                    // Files support.
import tmp from 'tmp';                                  // Create temporary files.
import shasum from 'shasum';                            // SHA hash.
import mkdirp from 'mkdirp';                            // Hierarhical mkdir.

// Vue.js
import vueify from 'vueify';                            // Vue.js reactive components.

import glob from 'glob';


//
// CONSTS
//


const is_dev = config.__MODE__ == "DEV" || config.__MODE__ == "STAGE" || config.__MODE__ == "TEST";
const is_prod = config.__MODE__ == "PROD";


// Patterns define what to include into vendor.min.js bundle.
const vendor_patterns = [
    /frontend\/node_modules/,
    // /frontend\/src\/data/
];


const global_bundle_opts = {
    "extract-css" : false,
    "obfuscate-lib-paths" : false,
    "uglify": false,
    "hotreloadapi" : false,
    "is-sourcemap" : true,
    "is-watchify": false,
    "css-bundle-name" : undefined,
    "js-bundle-name" : undefined
};


//
// GULP
//


// Display all tasks.
gulp.task('help', taskListing);



// Live reloading.
const bs = browserSync.create();
gulp.task('browser-sync', function () {
    bs.init(null, {
        port: config.fe_port,
        ui: {
            port: config.port
        },
        ghostMode: is_dev,
        notify: false,
        server: {
            baseDir: "./"+config.build_dest+"/app",
            routes: {
                '/favicon.ico': "./"+config.build_dest+"/app" + '/img/favicon.ico',
            },
            middleware: [ history({
                verbose: is_dev,
                rewrites: [
                    {
                        from: /^.*(\/img\/.*)/,
                        to: function (context) {
                            return context.match[1];
                        }
                    },
                    {
                        from: /^.*static(\/.*)/,
                        to: function (context) {
                            return context.match[1];
                        }
                    },
                    {
                        from: /^.*(\/follow\/.*)/,
                        to: "/index.html"
                    }
                ]
            }) ]
        }
    });
});


// Start frontend server.
gulp.task('frontend-server', function () {
    let server = serverFactory.create({
        path: './build/app',
        port: config.fe_port,
        fallback: function (request, response) {
            // URL to be matched.
            let match;

            match = /^.*(\/img\/.*)/.exec(request.url);
            if (match) {
                gutil.log(`Rewriting GET ${request.url} to ${match[1]}`);
                return match[1];
            }

            match = /^.*static(\/.*)/.exec(request.url);
            if (match) {
                gutil.log(`Rewriting GET ${request.url} to ${match[1]}`);
                return match[1];
            }

            match = /^\/favicon\.ico/.exec(request.url);
            if (match) {
                gutil.log(`Rewriting GET ${request.url}.`);
                return '/img/favicon.ico';
            }

            // Falling back to default page.
            gutil.log(`Serving GET ${request.url}`);
            return '/index.html';
        }
    });

    server.start();
});


// Copy index HTML files.
gulp.task('app-html', function () {
    return gulp.src('src/index.html')
        .pipe( size({ title:"HTML:" }) )
        .pipe( replace('<main-application-name>', config.app_name) )
        .pipe( gulp.dest(config.build_dest+"/app") )
});

// Copy everything under static HTML folder.
gulp.task('app-static-html', function () {
    return gulp.src('src/html/**/*')
        .pipe( size({ title:"Static HTML:" }) )
        .pipe( replace('<main-application-name>', config.app_name) )
        .pipe( replace('<main-application-title>', config.app_title) )
        .pipe( replace('<email-support-address>', config.email_support_address) )
        .pipe( gulp.dest(config.build_dest+"/app/html") )
});

// Copy images and svg graphics.
gulp.task('app-images', function () {
    return gulp.src(
        ['src/img/**/*.jpg',
         'src/img/**/*.png',
         'src/img/**/*.gif',
         'src/img/**/*.ico',
         'src/img/**/*.svg'],
        { base:"./src/img" }
    )
        .pipe( size({ title:"Images:" }) )
        .pipe( gulp.dest(config.build_dest+"/app/img") )
});

// Compile CSS files.
gulp.task('app-vendor-css', function () {
    return gulp.src([ 'src/vendor/css/**/*.css' ], { base:"./src/app" })
        .pipe( size({ title:"Vendor-css:" }) )
        .pipe( gulp.dest(config.build_dest+"/app") )
        .pipe( bs.stream() );
});


// Copy selected node packages to the build directory.
gulp.task('app-node-vendor-modules', function () {
    let sources = [];
    for (let [k, v] of _.toPairs(config.node_vendor_modules)) {
        for (let part of v) {
            sources.push(`./node_modules/${k}/${part}`);
        }
    }

    return gulp.src(sources, { base:"./node_modules" })
        .pipe( size({ title:"Extra-node-vendor-modules:" }) )
        .pipe( gulp.dest(config.build_dest+"/app/vendor") )
});


// Compile vendor JS files.
gulp.task('app-vendor-scripts', function () {
    return gulp.src([ 'src/vendor/js/**/*.js' ], { base:"./src/app" })
        .pipe( size({ title:"Extra-vendor-scripts:" }) )
        .pipe( gulp.dest(config.build_dest+"/app") )
});


// Compile vendor JS files.
gulp.task('app-static-scripts', function () {
    return gulp.src([ 'src/static/js/**/*.js' ], { base:"./src/static" })
        .pipe( size({ title:"Extra-static-scripts:" }) )
        // .pipe( replace('<no-browser-url>', ":" + config.be_port + config.base_uri + '/invitation/incompatible') )
        // .pipe( replace('<frontend-css-bundle>', 'static/js/bundle.min.css') )
        .pipe( replace('<frontend-scripts-array>', JSON.stringify(['vendor.min.js'])) )
        .pipe( replace('<no-browser-url>', config.paths_api_prefix + '/invitation/incompatible') )
        .pipe( replace('<main-application-file>', config.main_application_file.replace('.js', '.min.js')) )
        .pipe( replace('<main-application-name>', config.app_name) )
        .pipe( gulp.dest(config.build_dest+"/app") )
});


//
// Javascript bundling task.
//


// Check if object has changed by serializing it's hash.
// Return the changed / not changed status.
// Write a new hash.
const has_obj_changed = function (obj, name) {
    // Create .cache directory if it does not exists.
    if (!fs.existsSync(config.build_dest + '/.cache'))
        mkdirp.sync(config.build_dest + '/.cache');

    // Read hash from the hash file, if it exists.
    let hash_file = config.build_dest + '/.cache' + '/' + name + ".hash";
    let hash_from_file = null;
    if (fs.existsSync(hash_file)) {
        hash_from_file = jsonfile.readFileSync(hash_file);
    }

    // Calculate new object hash.
    let hash_from_obj = shasum(obj);

    // Write down a new one, if it is different.
    if (hash_from_file != hash_from_obj)
        jsonfile.writeFileSync(hash_file, hash_from_obj, {}, obj => {if (obj) gutil.error(obj);});

    return hash_from_file != hash_from_obj;
};


// Serialize dependencies to a json file.
const write_deps_to_a_file = function (deps, patterns, target_dir) {
    let selected_deps = {};
    for (let key in deps) {
        if (_.some(patterns, i => i.test(key)))
            selected_deps[key] = deps[key];
    }

    let json_file = target_dir + '/dependencies.json';
    jsonfile.writeFileSync(json_file, selected_deps, {spaces: 2}, obj => {if (obj) gutil.error(obj);});
};


// Find vendor (rarely changing) dependencies.
const find_vendor_deps = function () {
    let opts = {
        entries: [config.main_application_file],
        paths: ['./src', './'],
        ignoreWatch: ['**/node_modules/**'],
        debug: false,
        cache: {},
        packageCache: {},
        fullPaths: true
    };
    opts = _.assign({}, watchify.args, opts);

    // Only if package.json has changed calculate new vendor dependencies.
    let pj = require('./package.json');
    if (!has_obj_changed(pj, 'dependencies')) {
        return;
    }

    // Calculate new dependencies.
    let deps = {};
    const bundler = browserify(opts)
        .transform(configurify, {
            pattern: "**/config.js"
        })
        .transform(configurify, {
            pattern: "**/data/i18n-locales.js"
        })
        .transform(babelify, clone(config.babel))
        .transform(vueify, {
            "sass": {
                includePaths: config.paths_sass
            },
            hotreloadapi: false
        })
        .transform(envify({
            NODE_ENV: is_dev ? 'development' : 'production'
        }), { global: true });

    bundler.pipeline.get('deps').push(through2.obj(
        function (row, enc, next) {
            if (!(row.id in deps))
                deps[row.id] = {};

            deps[row.id].file = row.file;
            deps[row.id].deps = row.deps;
            if (!deps[row.id].expose)
                deps[row.id].expose = [];

            // Add alias from current dependencies to other deps.
            for (let alias in row.deps) {
                let target_id = row.deps[alias];
                if (!(target_id in deps))
                    deps[target_id] = {};
                if (!deps[target_id].expose)
                    deps[target_id].expose = [];
                if (!deps[target_id].expose.includes(alias))
                    deps[target_id].expose.push(alias);
            }
            next(null, row);
        }
    ));

    const stream = bundler.bundle()
        .on('error', function (err) {
            gutil.log(err.message);
            this.emit('end');

            throw new gutil.PluginError({
              plugin: "find_vendor_deps",
              message: err.message
            });
        })
        .pipe( source() )
        .pipe( buffer() )
        .pipe( through2.obj(function (row, enc, next) {
            write_deps_to_a_file(deps, vendor_patterns, config.build_dest + '/.cache');
            next(null, row);
        }) )
        .pipe( size({title: "Calculating dependencies:"}) );

    return stream;
};
gulp.task('find-vendor-deps', find_vendor_deps);


const attach_dep_handlers = function (bundler, opts, entries, externals) {
    // Override defaults with function options.
    let bundle_opts = _.assign({}, global_bundle_opts, opts);

    let hashes = {};
    const hasher = through2.obj(function (row, enc, next) {
        hashes[row.id] = shasum(row.id);

        if (!entries || entries.length == 0) {
            this.push(row);
        }
        else if (!_.includes(externals, row.id)) {
            this.push(row);
        }

        next();
    });
    bundler.pipeline.get('deps').push(hasher);

    const labeler = through2.obj(function (row, enc, next) {
        row.id = hashes[row.id];

        Object.keys(row.deps).forEach(function (key) {
            row.deps[key] = hashes[row.deps[key]];
        });

        // Replace in source full lib. paths with hashes.
        for(let source_path in hashes) {
            if (row.source.search(source_path) != -1)
                row.source = row.source.replace(new RegExp(source_path, 'g'), hashes[source_path])
        }

        this.push(row);
        next();
    });

    if (bundle_opts['obfuscate-lib-paths'])
        bundler.pipeline.get('label').splice(0, 1, labeler);
};


const create_bundler = function (opts, entries, externals) {
    // Override defaults with function options.
    let bundle_opts = _.assign({}, global_bundle_opts, opts);

    // Check mandatory parameters.
    if (bundle_opts['extract-css'] && !bundle_opts['css-bundle-name'])
        return;

    if (!bundle_opts['js-bundle-name'])
        return;

    // Browserify options.
    let browserify_opts = {
        entries: entries,
        paths: ['./src/app', './src', './'],
        ignoreWatch: ['**/node_modules/**'],
        debug: bundle_opts['is-sourcemap'],
        cache: {},
        packageCache: {},
        fullPaths: true
    };
    browserify_opts = _.assign({}, watchify.args, browserify_opts);

    const bundler = browserify(browserify_opts)
        .transform(configurify, {
            pattern: "**/config.js"
        })
        .transform(configurify, {
            pattern: "**/data/i18n-locales.js"
        })
        .transform(babelify, clone(config.babel))
        .transform(vueify, {
            "sass": {
                includePaths: config.paths_sass
            },
            hotreloadapi: bundle_opts['hotreloadapi']
        })
        .transform(envify({
            NODE_ENV: is_dev ? 'development' : 'production'
        }), { global: true });

    if (bundle_opts['extract-css']) {
        bundler.plugin('vueify-extract-css', { out: config.build_dest + '/app/js/' + bundle_opts['css-bundle-name'] });
    }

    if (bundle_opts['hotreloadapi']) {
        bundler.plugin(hmr);
    }

    if (bundle_opts['is-watchify']) {
        bundler.plugin(watchify);
    }

    if (!entries || entries.length == 0) {
        externals.forEach(function (file) {
            bundler.require(file);
        });
    }

    return bundler;
};


const create_rebundler_function = function (bundler, rel_path, opts, entries, external) {
    return () => {
        // Override defaults with function options.
        let bundle_opts = _.assign({}, global_bundle_opts, opts);

        const stream = bundler
            .bundle()
            .on('error', function (err) {
                gutil.log(err.message);
                this.emit('end');
            })
            .pipe( source(bundle_opts['js-bundle-name']) )
            .pipe( buffer() )

            // Sourcemap transformations.
            .pipe( gulpif(is_dev && bundle_opts['is-sourcemap'], sourcemaps.init({loadMaps: true})) )
            // Add transformation tasks to the pipeline here.
            .pipe( gulpif(is_prod || bundle_opts['uglify'], uglify().on('error', gutil.log)) )
            .pipe( gulpif(is_dev && bundle_opts['is-sourcemap'], sourcemaps.write()) )

            .pipe( rename({suffix: '.min'}) )
            .pipe( size({title: "Scripts:"}) )
            .pipe( gulp.dest(config.build_dest + "/" + rel_path) )
            .pipe( bs.stream() )
            .pipe( gulpif(is_dev, notify({
                message: 'Updated: <%= file.relative %>',
                title: 'Gulp build process'
            })) );

        // Add dependencies handlers.
        attach_dep_handlers(bundler, bundle_opts, entries, external);

        return stream;
    }
};


gulp.task('split-bundler-vendor', function () {
    let vendor_files = jsonfile.readFileSync(config.build_dest + '/.cache' + '/dependencies.json');
    vendor_files = _.keys(vendor_files);

    // Bundle defaults.
    let bundle_opts = {
        "is-sourcemap": false,
        "obfuscate-lib-paths": is_prod,
        "js-bundle-name": "vendor.js"
    };
    bundle_opts = _.assign({}, global_bundle_opts, bundle_opts);

    // Create bundler and rebundler (can be called multiple times to create a new stream each time).
    let vendor_bundler = create_bundler(
        bundle_opts, [],
        vendor_files
    );

    let vendor_rebundler = create_rebundler_function(
        vendor_bundler, '.cache',
        bundle_opts, [],
        vendor_files
    );

    // Only if package.json has changed, create new vendor bundle.
    let pj = require('./package.json');
    if (has_obj_changed(pj, 'vendor_bundle') || !fs.existsSync(config.build_dest + "/.cache/vendor.min.js")) {
        return vendor_rebundler()
            .pipe( gulp.dest(config.build_dest + "/.cache") )
    }
});


gulp.task('split-bundler-main', function () {
    // Stream merging.
    let stream = new MergeStream();

    // Copy files.
    stream.add(gulp
        .src(config.build_dest + "/.cache/vendor.min.js")
        .pipe( gulp.dest(config.build_dest + "/app/js") )
    );

    let vendor_files = jsonfile.readFileSync(config.build_dest + '/.cache' + '/dependencies.json');
    vendor_files = _.keys(vendor_files);

    // Bundle defaults.
    let bundle_opts = {
        "is-sourcemap": false,
        "obfuscate-lib-paths": is_prod,
        "is-watchify": true,
        "js-bundle-name": "frontend.js"
    };
    bundle_opts = _.assign({}, global_bundle_opts, bundle_opts);

    // Build frontend files.
    let frondent_bundler = create_bundler(
        bundle_opts, [config.main_application_file],
        vendor_files
    );

    frondent_bundler.on('update', create_rebundler_function(
        frondent_bundler, '/app/js',
        bundle_opts, [config.main_application_file],
        vendor_files)
    );

    frondent_bundler.on('log', gutil.log);

    let frontend_rebundler = create_rebundler_function(
        frondent_bundler, '/app/js',
        bundle_opts, [config.main_application_file],
        vendor_files);
    stream.add(frontend_rebundler());

    // Watch .i18n.js files.
    watch('src/**/*.i18n.js', function () {
        frondent_bundler.emit('invalidate', require.resolve('src/data/i18n-locales.js'));
    });

    return stream;
});


gulp.task('split-bundler', function () {
    runSequence(
        'find-vendor-deps',
        'split-bundler-vendor',
        'split-bundler-main'
    )
});


// To run browserify from command line,
// configure vue.config.js with proper sass paths, then run:
// NODE_PATH=./src/app:./src:./ browserify -t babelify -t vueify --debug frontend.js

const prepare_bundler = function () {
    let opts = {
        entries: './' + config.main_application_file,
        paths: ['./src/app', './src', './'],
        ignoreWatch: ['**/node_modules/**'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    };
    opts = _.assign({}, watchify.args, opts);

    let bundler = browserify(opts)
        .transform(configurify, {
            pattern: "**/config.js"
        })
        .transform(configurify, {
            pattern: "**/data/i18n-locales.js"
        })
        .transform(babelify, clone(config.babel))
        .transform(vueify, {
            "sass": {
                includePaths: config.paths_sass
            },
            hotreloadapi: false
        })
        .transform(envify({
            NODE_ENV: is_dev ? 'development' : 'production'
        }), { global: true });
    bundler.plugin(watchify);

    return bundler;
};

const create_bundler_function = function (bundler) {
    return () => {
        return bundler.bundle()
            .on('error', function (err) {
                gutil.log(err);
                this.emit('end');
            })
            .pipe( source(config.main_application_file) )
            .pipe( buffer() )

            // Sourcemap transformations.
            .pipe( gulpif(is_dev, sourcemaps.init({loadMaps: true})) )
            // Add transformation tasks to the pipeline here.
            .pipe( gulpif(is_prod, uglify().on('error', gutil.log)) )
            .pipe( gulpif(is_dev, sourcemaps.write()) )

            .pipe( rename({suffix: '.min'}) )
            .pipe( size({title: "Scripts:"}) )
            .pipe( gulp.dest(config.build_dest + '/app/js') )
            .pipe( bs.stream() )
            .pipe( gulpif(is_dev, notify({
                message: 'Updated: <%= file.relative %>',
                title: 'Gulp build process'
            })) );
    }
};

let bundler = prepare_bundler();
bundler.on('update', create_bundler_function(bundler));
bundler.on('log', gutil.log);

// Compile JS files task.
// gulp.task('app-scripts', create_bundler_function(bundler));
gulp.task('app-scripts', function () {
    runSequence('split-bundler')
});

// Analyse JS bundle.
gulp.task('analyse', function () {
    let tmp_file_obj = tmp.fileSync({postfix:'.html', keep:true});

    return fs.createReadStream(config.build_dest + '/app/js/' + config.main_application_file.replace('.js', '.min.js'))
        .pipe(disc())
        .pipe(fs.createWriteStream(tmp_file_obj.name))
        .once('close', function () {
            opener(tmp_file_obj.name);
            setTimeout(function () {
                tmp_file_obj.removeCallback();
            }, 5000);
        })
});

// Watch for file changes (not in vendor files).
gulp.task('watch', function ()  {
    if (is_dev) {
        notifier.notify({
            message: 'Watching files ...',
            title: 'Gulp build process'
        });
    }

    let _notify = function (vinyl_file) {
        let msg = 'Updated: ' + vinyl_file.path;

        if (is_dev) {
            notifier.notify({
                message: msg,
                title: 'Gulp build process'
            });
        }

        gutil.log(msg);
    };

    // Watch html-files.
    watch('src/**/*.html', function (vinyl_file) {
        _notify(vinyl_file);
        runSequence('app-html', bs.reload);
    });

    // Watch static-html-files.
    watch('src/html/**/*', function (vinyl_file) {
        _notify(vinyl_file);
        runSequence('app-static-html', bs.reload);
    });

    // Watch vendor image-files.
    watch('src/img/**/*', function (vinyl_file) {
        _notify(vinyl_file);
        runSequence('app-images');
    });

    // Watch vendor css-files.
    watch('src/vendor/css/**/*.css', function (vinyl_file) {
        _notify(vinyl_file);
        runSequence('app-vendor-css');
    });

    // Watch vendor js-files.
    watch('src/vendor/js/**/*.js', function (vinyl_file) {
        _notify(vinyl_file);
        runSequence('app-vendor-scripts', bs.reload);
    });

    // Watch static js-files.
    watch('src/static/js/**/*.js', function (vinyl_file) {
        _notify(vinyl_file);
        runSequence('app-static-scripts', bs.reload);
    });
});


gulp.task('clean', function ()  {
    return del([
        config.build_dest+'/app/**/*',
        config.build_dest+'/*'
        // config.build_dest+'/.cache'
    ]);
});


gulp.task('default', function ()  {
    gulp.start('help');
});


gulp.task('frontend-build', function () {
    runSequence(
        [
            'app-scripts', 'app-html',
            'app-static-scripts', 'app-static-html',
            'app-images',
            'app-vendor-scripts', 'app-node-vendor-modules', 'app-vendor-css'
        ]
    )
});


gulp.task('start', function () {
    runSequence(
        'clean',
        'frontend-build',
        'watch',
        'browser-sync'
    );
});
