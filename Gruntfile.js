module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        copy: {
            build: {
                files: [{
                    expand: true,
                    src: [
                        "fonts/**/*.{woff,woff2}",
                        "img/**",
                        "js/**",
                        ".html"
                    ],
                    dest: "build"
                }]
            },
            html: {
                files: [{
                    expand: true,
                    src: ["*.html"],
                    dest: "build"
                }]
            },
            img: {
                files: [{
                    expand: true,
                    src: ["img/**"],
                    dest: "build"
                }]
            }
        },
        clean: {
            build: ["build"],
            img: ["build/img"],
            svg: ["build/img/*.svg"]
        },
        less: {
            style: {
                files: {
                    "build/css/style.css": "less/style.less"
                }
            }
        },
        postcss: {
            options: {
                processors: [
                    require("autoprefixer")({
                        browsers: "last 2 versions"
                    }), 
                    require("css-mqpacker")({
                        sort: true
                    })
                ]
            },
            dist: {
              src: "build/css/*.css"
            }
        },
        csso: {
            style: {
                options: {
                    report: "gzip"
                },
                files: {
                    "build/css/style.min.css": ["build/css/style.css"]
                }
            }
        },
        imagemin: {
            images: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    src: ["build/img/**/*.{png,jpg}"]
                }]
            }
        },
        svgstore: {
            options: {
                svg: {
                    style: "display: none",
                    xmlns: "http://www.w3.org/2000/svg"
                }
            },
            symbols: {
                files: {
                    "build/img/symbols.svg" : ["img/svg/*.svg"]
                }
            }
        },
        svgmin: {
            symbols: {
                files: [{
                    expand: true,
                    src: ["img/svg/*.svg"]
                }]
            }
        },
        watch: {
            html: {
                files: ["*.html"],
                tasks: ["copy:html"]
            },
            img: {
                files: ["img/**/*.{png,jpg}"],
                tasks: ["clean:img", "copy:img", "imagemin"]
            },
            svg: {
                files: ["img/svg/**"],
                tasks: ["clean:svg", "svgmin", "svgstore"]
            },
            style: {
                files: ["less/**/*.less"],
                tasks: ["less", "postcss", "csso"]
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: ["build/*.html", "build/css/*.css"]
                },
                options: {
                    watchTask: true,
                    server: "build"
                }
            }
        }
    });

    grunt.registerTask("serve", ["browserSync", "watch"]);
    grunt.registerTask("symbols", ["svgmin", "svgstore"]);
    grunt.registerTask("build", [
        "clean",
        "copy",
        "less",
        "postcss",
        "csso",
        "imagemin",
        "svgmin",
        "svgstore"
    ]);

}