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
import taskListing from 'gulp-task-listing';            // List all tasks.
import runSequence from 'run-sequence';                 // Run sequence of tasks.
import gutil from 'gulp-util';                          // Logs
import watch from 'gulp-watch';                         // Fast chokidar style watcher.
import mocha from 'gulp-mocha';                         // Mocha support.

import nodemon from 'gulp-nodemon';                     // Live reloading of backend.
import * as _ from 'lodash';                            // Lodash.


//
// GULP
//


// Display all tasks.
gulp.task('help', taskListing);


// Start backend servers.
gulp.task('backend-server', function (cb) {
    let started = false;

    nodemon({
        script: './src/backend.js',
        watch: ['src', 'config*.js'],
        ext: 'js json schema'
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    });
});


gulp.task('clean', function ()  {
    return del([
        // config.build_dest+'/.cache'
    ]);
});


gulp.task('test-be', function () {
    return gulp.src('test/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec'}))
        .once('error', () => {
            process.exit(1);
        })
        .once('end', () => {
            process.exit();
        });
});

gulp.task('default', function ()  {
    gulp.start('help');
});


gulp.task('start', function () {
    runSequence(
        'clean',
        'backend-server'
    );
});
