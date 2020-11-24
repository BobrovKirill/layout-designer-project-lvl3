const { extend } = require('jquery');


let projectFolder = 'dist';
let sourceFolder = 'app';

let path = {
  build: {
    html: projectFolder + '/',
    css: projectFolder + '/styles/',
    js: projectFolder + '/js/',
    img: projectFolder + '/images/',
    fonts: projectFolder + '/fonts/',
  },
  src: {
    pug: sourceFolder + '/index.pug',
    css: sourceFolder + '/scss/app.scss',
    js: sourceFolder + '/js/',
    img: sourceFolder + '/images/**/*.{jpg,png,svg,gif,ico}',
    fonts: sourceFolder + '/fonts/*.ttf',
  },
  watch: {
    pug: sourceFolder + '/**/*.pug',
    css: sourceFolder + '/**/*.scss',
    js: sourceFolder + '/js/**/*.js',
    img: sourceFolder + '/img/**/*.{jpg,png,svg,gif,ico}',
  },
  clean: './' + projectFolder + '/',
};

let { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create();
  scss = require('gulp-sass');
  del = require('del');
  pug =  require('gulp-pug');
  imagemin = require('gulp-imagemin');
 
function img(){
    return gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img))
}

function pugToHtml(){
    return gulp.src(path.src.pug)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.build.html));
 }

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: './' + projectFolder + '/',
    },
    port: 3000,
    notify: false,
  });
}


function watchFiles(params) {
  gulp.watch([path.watch.pug], pugToHtml);
  gulp.watch([path.watch.css], css);
}
function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: 'extended',
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}
function clean(params) {
  return del(path.clean);
}

let build = gulp.series(clean, img, gulp.parallel(pugToHtml, css));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.img = img;
exports.pugToHtml = pugToHtml;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = watch;
