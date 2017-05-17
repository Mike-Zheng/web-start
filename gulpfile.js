//2016/2/11 Mike
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect'),
    del = require('del'),
    ejs = require("gulp-ejs"),
    htmlmin = require('gulp-html-minifier'),
    gutil = require('gulp-util'),
    colors = gutil.colors,
    shell = require('gulp-shell');

var paths = {
    'root': './app/',
    'style': {
        src: './scss/**.scss',
        output: './app/css/'
    },
    'js': {
        src: './prejs/**.js',
        output: './app/js/'
    },
    'html': {
        src: './app/**.html',
        output: './app/'
    }
};

//自動更新及localhost server開發
gulp.task('connect', function() {
    connect.server({
        root: paths.root,
        livereload: true
    });
});

//重置
gulp.task('clean', function() {
    return del(['build']);
});

// Sass編譯任務
gulp.task('sass', ['clean'], function() {
    return gulp.src([paths.style.src])
        .pipe(sourcemaps.init())
        .pipe(plumber()) // 使用 gulp-plumber 處理例外
        .pipe(sass({
                // outputStyle: 'nested'
                outputStyle: 'compressed'
            })
            .on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(minifycss({ keepSpecialComments: 1 }))
        .pipe(gulp.dest(paths.style.output))
        .pipe(connect.reload());
});

//Js壓縮任務
gulp.task('concatJs', ['clean'], function() {
    return gulp.src([paths.js.src])
        .pipe(sourcemaps.init())
        .pipe(plumber())
        //.pipe(uglify({output: {comments: /^!|@preserve|@license|@cc_on/i}}))
        .pipe(concat('miz.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.js.output))
        .pipe(connect.reload());
});


gulp.task('minify-html', function() {
    gulp.src(paths.html.src)
        //.pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.html.output))
        .pipe(connect.reload());
});

//ejs 編譯任務
//gulp.task('renderEJS', function() {
//    gulp.src("./views/*.ejs")
//        .pipe(ejs({}, { ext: '.html' }))
//        .pipe(gulp.dest("./app/"));
//});


gulp.task('openSublime', function() {
    //shell.task('sublime .')
});

//任務"css"負責'sass'這個版型相關的編譯任務
gulp.task('css', ['sass']);
//任務"concatJs"負責'js壓縮任務
gulp.task('js', ['concatJs']);

gulp.task('html', ['minify-html']);

gulp.task('default', ['connect', 'html', 'css', 'js', 'openSublime'], function() {
    console.log('\n ' + colors.red('•') + colors.cyan(' [啟動] ') + 'Gulp 初始化！');
    gulp.watch('./scss/**/**.scss', ['css']);
    gulp.watch('./prejs/**/**.js', ['js']);
    gulp.watch('./app/**/**.html', ['minify-html']);
    //gulp.watch('./views/**/**.ejs', ['renderEJS']);
});



