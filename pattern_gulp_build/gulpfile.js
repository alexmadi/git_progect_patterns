'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var connect     = require('gulp-connect');
var livereload  = require('gulp-livereload');
var open        = require('gulp-open');
var imagemin    = require('gulp-imagemin');

// -----------------------------------------------------------------------------
// Configuration / settings 
// -----------------------------------------------------------------------------
var input = 'scss/**/*.scss';
var output = 'production/css';
var input_html = './production/*.html';

var options = {
    sass: {
        outputStyle: 'extended'
    }
};

// -----------------------------------------------------------------------------
// Server connect
// -----------------------------------------------------------------------------
gulp.task('connect', function() {
    connect.server({
        root: './production/',
        port: 8888,
        //https: true,
        //livereload: true
    });
    
});

// -----------------------------------------------------------------------------
// Sass compilation
// -----------------------------------------------------------------------------
gulp.task('sass', function () {
    return gulp.src(input)
        .pipe(sourcemaps.init())
        .pipe(sass(options.sass).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(output));
});

gulp.task('html', function () {
    return gulp.src(input)
        .pipe(livereload());
});


// -----------------------------------------------------------------------------
// IMG Compressing
// -----------------------------------------------------------------------------

gulp.task('image', function () {
    return gulp.src('img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('production/img'))
});

// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(input, ['sass']).on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });


    gulp.watch(input_html, ['sass']);
    // sets up a livereload that watches for any changes in the root
    //gulp.watch(input_html).on('change', function(event) {
    //    livereload();
    //});
    gulp.src('')
    .pipe(open({app: 'chrome', uri: 'http://localhost:8888'}));
});

gulp.task('default', ['connect', 'sass', 'watch']);
