module.exports = function(grunt) {

  grunt.initConfig({
    pkg: '<json:package.jquery.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    compass: {
      dev: {
        src: 'scss',
        dest: 'css',
        linecomments: false,
        require: [],
        debugsass: true,
        relativeassets: true
      },
      prod: {
        src: 'scss',
        dest: 'css',
        linecomments: false,
        require: [],
        debugsass: false,
        relativeassets: true,
        environment: 'production'
      }
    },
    concat: {
      js: {
        src: ['<banner:meta.banner>', 'js/ui.multiselect.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      css: {
        src: ['<banner:meta.banner>', 'css/ui.multiselect.js'],
        dest: 'dist/<%= pkg.name %>.css'
      }
    },
    lint: {
      files: ['js/ui.multiselect.js']
    },
    min: {
      js: {
        src: ['dist/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      js: {
        files: ['js/ui.multiselect.js'],
        tasks: 'lint concat:js min:js'
      },
      css: {
        files: 'scss/*.scss',
        tasks: 'compass:dev concat:css'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-compass');

  grunt.registerTask('default', 'compass lint concat min');

};