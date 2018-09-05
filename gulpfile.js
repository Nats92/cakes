`use strict`;

const gulp = require(`gulp`);
const less = require(`gulp-less`);
const plumber = require(`gulp-plumber`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const server = require(`browser-sync`).create();
const minify = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const imagemin = require(`gulp-imagemin`);
const webp = require(`gulp-webp`);
const svgstore = require(`gulp-svgstore`);
const posthtml = require(`gulp-posthtml`);
const include = require(`posthtml-include`);
const del = require(`del`);
const sourcemaps = require(`gulp-sourcemaps`);
const rollup = require(`gulp-better-rollup`);
const gcmq = require(`gulp-group-css-media-queries`);

gulp.task(`clean`, () => {
    return del(`./build`);
});

gulp.task(`copy`, () => {
    return gulp.src([
            `./fonts/**/*.{woff, woff2}`,
            `./img/**`,
            `./js/**`
        ], {
        base: `./`
    })
    .pipe(gulp.dest(`./build`));
});

gulp.task(`style`, () => {
  return gulp.src(`./less/style.less`)
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
        autoprefixer({browsers: [`last 2 version`]})
    ]))
    .pipe(gcmq())
    .pipe(gulp.dest(`./build/css`))
    .pipe(minify())
    .pipe(rename(`style.min.css`))
    .pipe(gulp.dest(`./build/css`))
    .pipe(server.stream());
});

gulp.task(`images`, () => {
    return gulp.src(`./build/img/**/*{.png, .jpg, .jpeg}`)
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true}),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest(`./build/img`))
});

gulp.task(`webp`, () =>
    gulp.src(`./img/**/*`)
        .pipe(webp())
        .pipe(gulp.dest(`./build/img`))
);

gulp.task(`svgsprite`, () => {
    return gulp.src(`./build/img/**/*.svg`)
        .pipe(svgstore())
        .pipe(rename(`sprite.svg`))
        .pipe(gulp.dest(`./build/img`));
});

gulp.task(`html`, () => {
    return gulp.src(`./*html`)
        .pipe(posthtml([include()]))
        .pipe(gulp.dest(`./build`));
});

gulp.task(`js`, () => {
    return gulp.src(`./build/js/**`)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rollup({}, `umd`))
        .pipe(sourcemaps.write(``))
        .pipe(gulp.dest(`./build/js`))
});

gulp.task(`serve`, () => {
    server.init({
        server: `./build/`
    });

    gulp.watch(`./less/**/*.less`, gulp.series(`style`));
    gulp.watch(`./*.html`, gulp.parallel(`html`, server.reload));
    gulp.watch(`./js/**/*.js`, gulp.parallel(`js`, server.reload));
});

gulp.task(`build`, gulp.series([
        `clean`,
        `copy`,
        `style`,
        `images`,
        `svgsprite`,
        `js`,
        `html`
    ]));

