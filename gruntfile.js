module.exports = function(grunt) {

    var banner = '/*! <%= pkg.name %> - <%= pkg.description %> - Version: <%= pkg.version %> */\n';
    // Configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        uglify : {
            options : {
                banner: banner
            },
            build : {
                src  : 'src/**/*.js',
                dest : 'dist/<%= pkg.name %>.min.js'
            }
        },
        concat : {
            options: {
                banner: banner
            },
            dist: {
                src: 'src/**/*.js',
                dest: 'dist/<%= pkg.name %>.js'
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Register tasks
    grunt.registerTask('default', ['uglify', 'concat']);
};
