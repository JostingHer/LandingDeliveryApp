const {src, dest, watch, parallel} = require('gulp');

//CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer'); //se asegura de que funcione en el navegador que tu le digas
const cssnano = require('cssnano'); //comprimie nuestro css 
const postcss = require('gulp-postcss');


//imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin'); 
// npm i --save-dev gulp-imagemin@7.1.0
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const sourcemaps = require('gulp-sourcemaps');

//javascript

const terser = require('gulp-terser-js')

//como compilar la hoja de estilos de sass tres pasos
function css (done){

    src('src/scss/**/*.scss')// identificar el archivo SASS//src
      .pipe(sourcemaps.init())
      .pipe( plumber())
      .pipe( sass())//COMPILARLO
      // .pipe( postcss([ autoprefixer(), cssnano()]))
      .pipe( postcss([ autoprefixer()]))
      .pipe( sourcemaps.write('.'))
      .pipe( dest('build/css')) //ALmacenarla en el disco duro//dest
      
    done(); //callback que avisa a gulp cuando llegamos al final de la funcion
}

function imagenes(done){
  const opciones ={
    optimazationLevel: 3
  }

  src('src/img/**/*.{png,jpg}')
    .pipe( cache(imagemin(opciones)))
    .pipe( dest('build/img'))
  done();
}

function versionWebp(done){
  const opciones = {
    quality: 50
  }

  src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones)) //una vez que finaliza la transformacion se guardan em la memoria un tiempo por ello las guardamos en build/img
    .pipe(dest('build/img'))

  done();
}

function versionAvif(done){
  const opciones = {
    quality: 50
  }

  src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones)) //una vez que finaliza la transformacion se guardan em la memoria un tiempo por ello las guardamos en build/img
    .pipe(dest('build/img'))

  done();
}


function javascript (done){
    src('src/js/**/*.js') //identificar el archivo//
      .pipe(sourcemaps.init())
      .pipe(terser())
      .pipe( sourcemaps.write('.'))
      .pipe(dest('build/js'))  
    done();
}

function dev (done){
    watch('src/scss/**/*.scss', css);
    watch('src/**/*.js', javascript);
    done(); 
}
 
 
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel (imagenes, versionWebp, versionAvif, javascript, dev); //parallel: hacemoS que las funciones se ejecuten a la vez en paralelo

