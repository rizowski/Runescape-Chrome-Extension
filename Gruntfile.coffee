module.exports = (grunt) -> 
	
	# Project configuration
	grunt.initConfig {
		pkg: grunt.file.readJSON 'package.json'

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			}
		}

		# coffee: {
		# 	options: {
		# 		sourceMap: true
		# 		bare:  true
		# 	}
		# 	compile: {
		# 		files: {
		# 			'out/contentscript.js': 'res/coffee/contentscript.coffee'
		# 			'out/options.js': 'res/coffee/options.coffee'
		# 		}
		# 	}
		# }

		# sass: {
		# 	dist: {
		# 		files: {
		# 			'out/style.css' : 'res/style/style.sass'
		# 		}
		# 	}
		# }

		copy: {
			main: {
				files: [
					# {expand: true, flatten: true, src:['res/*'], dest: 'out/', filter: 'isFile'}
					{expand: true, flatten: true, src:['res/*'], dest: 'out/', filter: 'isFile'}
					{expand: true, flatten: true, src:['res/config/*'], dest: 'out/', filter: 'isFile'}
					{expand: true, flatten: true, src:['res/html/*'], dest: 'out/', filter: 'isFile'}
					{expand: true, flatten: true, src:['res/js/*'], dest: 'out/', filter: 'isFile'}
					{expand: true, flatten: true, src:['res/style/*'], dest: 'out/', filter: 'isFile'}
					{expand: true, flatten: true, src:['lib/*'], dest: 'out/', filter: 'isFile'}
					# {expand: true, flatten: true, src:['res/config/*'], dest: 'out/', filter: 'isFile'}
					# {expand: true, flatten: true, src:['lib/*'], dest: 'out/', filter: 'isFile'}
					# {expand: true, flatten: true, src:['js/*'],  dest: 'out/', filter: 'isFile'}
				]
			}
		}

		clean: ['out/']

		build: {
			# Fill this out
		}
	}

	# Load uglify
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-copy'
	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-contrib-sass'
	grunt.registerTask 'default', ['clean', 'uglify', 'copy']