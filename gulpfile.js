/**
 * @description
 * Requirements
 */
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    compass = require('gulp-compass'),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    path = require('path'),
    rename = require('gulp-rename');

/**
 * @description
 * Script task - minify all js files
 */
gulp.task('scripts', function(){

    gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
        .pipe(plumber())
        .pipe(rename({ suffix:'.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(reload({stream:true}));
});

/**
 * @description
 * Compass / Sass Tasks
 * Minify all scss files into one css file
 */
gulp.task('compass', function(){

    gulp.src('app/scss/style.scss')    
        .pipe(plumber())
        .pipe(compass({
            config_file: './config.rb',
            css: 'app/css',
            sass: 'app/scss',
            require: ['susy']
        }))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('app/css/'))
        .pipe(reload({stream:true}));

});

/**
 * @description
 * Less Tasks
 * Minify all less files into one css file
 */
gulp.task('less', function () {
  return gulp.src('app/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('app/css/'));
});

/**
 * @description
 * Watch for HTML files changes
 */
gulp.task('html', function(){

    gulp.src('app/**/*.html')  
        .pipe(reload({stream:true}));
});



// ///////////////////////////
// Browser-sync Tasks
// ///////////////////////////
gulp.task('browser-sync', function(){

    browserSync({
        server:{
            baseDir: "./app/"
        }
    });   
});

// task to run build server for testing final app
gulp.task('build:serve', function(){

    browserSync({
        server:{
            baseDir: "./build/"
        }
    });   
});

/**
 * @description
 * Watch tasks
 */
gulp.task('watch', function(){

    gulp.watch('app/js/**/*.js', ['scripts']);
    gulp.watch('app/scss/**/*.scss', ['compass']);
    gulp.watch('app/less/**/*.less', ['compass']);
    gulp.watch('app/**/*.html', ['html']);
});

/**
 * @description
 * Building production front-end tasks
 */

//clear out all files and folders from build folder
gulp.task('build:clean', function(){
    console.log('cleaning...');
    return del([
        'build/**'
    ]);   
});

// task to create build directory for all files
gulp.task('build:copy', ['build:clean'], function(){
     console.log('copying...');
    return gulp.src('app/**/*/')
            .pipe(gulp.dest('build/'));
            
});

// task to remove unwanted build files
// list all files and folders here that we don't want to include
gulp.task('build:remove', ['build:copy'], function(){
    console.log('removing...');
    return del([
        'build/scss/',
        'build/js/!(*.min.js)'
    ]);
});

gulp.task('build', ['build:copy', 'build:remove']);

/**
 * @description
 * Default task - runs when type in console 'gulp' only
 */
gulp.task('default', ['scripts', 'compass', 'html', 'browser-sync', 'watch']);