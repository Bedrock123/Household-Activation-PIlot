module.exports = function(grunt) {
    grunt.initConfig({
            concat: {
                js: {
                    src: [
                        'js/classie.js',
                        'js/pathLoader.js',
                        'js/main.js',
                        'js/scrollprogress.js',
                        'js/confetti.js',
                        'js/count.js'
                    ],
                    dest: 'build/js/scripts.js',
                },
                css: {
                    src: [
                        'css/normalize.css',
                        'css/demo.css',
                        'css/effect2.css',
                        'css/custom.css',
                        'css/v2-template.css',
                    ],
                    dest: 'build/css/styles.css',
                },
            },
            uglify: {
                my_target: {
                    files: {
                        'build/js/vender-scripts.min.js': ['build/js/scripts.js'],
                        'build/js/modernizr.custom.min.js': ['js/modernizr.custom.js'],
                    }
                }
            },
            watch: {
                js: {
                    files: ['js/**/*.js'],
                    tasks: ['concat', 'uglify'],
                },
                css: {
                    files: ['css/**/*.css'],
                    tasks: ['concat', 'postcss', 'cssmin'],
                },
                html: {
                    files: ['index.html'],
                    tasks: ['htmlmin'],
                },
            },
            htmlmin: { // Task
                dist: { // Target
                    options: { // Target options
                        removeComments: true,
                        collapseWhitespace: true
                    },
                    files: { // Dictionary of files
                        'index.min.html': 'index.html', // 'destination': 'source'
                    }
                },
            },
            sass: {
                options: {
                    sourceMap: true
                },
                dist: {
                    files: {
                        'scss/styles.css': 'scss/styles.scss'
                    }
                }
            },
            postcss: {
                options: {
                    map: true,
                    processors: [
                        require('autoprefixer')({ browsers: ['last 1 version'] })
                    ]
                },
                dist: {
                    src: 'build/css/styles.css'
                }
            },
            cssmin: {
                target: {
                    files: {
                        'build/css/styles.min.css': ['build/css/styles.css'],
                        'build/css/lite-custom.min.css': ['css/lite-custom.css']
                    }
                }
            },
        }),
        grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('default', ['postcss', 'htmlmin', 'concat', 'cssmin', 'uglify', 'watch']);



};