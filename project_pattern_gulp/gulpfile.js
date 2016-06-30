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
//var imagemin    = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');
var autoprefixer = require('gulp-autoprefixer');


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
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))       
        .pipe(gulp.dest(output));  
});
// -----------------------------------------------------------------------------
// IMG Compressing
// -----------------------------------------------------------------------------

// gulp.task('image', function () {
//     return gulp.src('src/img/*')
//         .pipe(imagemin())
//         .pipe(gulp.dest('production/img'))
// });

// -----------------------------------------------------------------------------
// Sprites
// -----------------------------------------------------------------------------

gulp.task('sprite', function() {
    var spriteData =
        gulp.src('./sprite/*.*') // source path of the sprite images
            .pipe(spritesmith({
                imgName: '../img/sprite.png',
                cssName: '_sprites.scss',
                cssFormat: 'scss',
                padding: 2
            }));

    spriteData.img.pipe(gulp.dest('./production/img/')); // output path for the sprite
    spriteData.css.pipe(gulp.dest('./scss/')); // output path for the CSS
});

// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(input, ['sass']).on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    // gulp.watch('src/img/*', function(event) {
    // gulp.run('image');
    // }); 
    gulp.watch('sprite/*', function(event) {
        gulp.run('sprite');
    });
    gulp.watch(input_html, ['sass']);
    gulp.src('')
    .pipe(open({app: 'chrome', uri: 'http://localhost:8888'})); 
   // firefox 

});

//gulp.task('default', ['html:build', 'js:build', 'image', 'sprite', 'fonts', 'connect', 'sass', 'watch']);

gulp.task('default', ['sprite', 'connect', 'sass', 'watch']);