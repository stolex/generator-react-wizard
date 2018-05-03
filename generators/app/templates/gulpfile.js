var gulp = require("gulp");
<% if (pack === "browserify") { %>
const browserify = require("browserify");
const fs = require("fs");<% } if (pack === "webpack") { %>
const webpack = require("webpack");
const path = require("path");
<% } %>
const DESTINATION = "./build/";
const SOURCE = "./src/";

var _isProduction = false;
/**
 * Check if Gulp already have set this task
 * @param {string} taskName 
 */
function _isTaskSet(taskName){
	if (gulp.tasks){
		for (let s in gulp.tasks){
			if (s === taskName){
				return true;
			}
		}
	}
	return false;
}

gulp.task("js", function () {
	<% if (pack === "browserify") { %>
		//create build directory if not exist
	if (!fs.existsSync(DESTINATION)) {
		fs.mkdirSync(DESTINATION.replace("./", ""));
	};
	browserify(SOURCE + "index.js", {
		insertGlobals: true,
		debug: !_isProduction
	}) <% if (babelReact) { %>
	.transform("babelify")<% } %>
	.bundle()
	.pipe(fs.createWriteStream(DESTINATION + "index.js"));
	<% } if (pack === "webpack") { %>
	webpack({
		mode: _isProduction ? "production" : "development",
		entry: SOURCE + "index.js",
		output: {
			path: path.resolve(__dirname, DESTINATION),
			filename: "index.js"
		}<% if(babelReact) { %>, module: {
			rules: [
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: "babel-loader"
				}
			]
		}<% } %>
	}, function(err, stats){
		if (err){
			console.log("Webpack error ", err);
		};
	})
	<% } %>
});

gulp.task("setProduction", function () {
	_isProduction = true;
})

gulp.task("html", function () {
	return gulp.src(SOURCE + "**/*.html")
		.pipe(gulp.dest(DESTINATION));
});

gulp.task("build", ["setProduction", "html", "js"]);

<% if (listen) { %>
gulp.task("watch", function () {
	gulp.watch(SOURCE + "**/*.html", ["html"]);
	gulp.watch(SOURCE + "**/*.js", ["js"]);
});

gulp.task("default", ["html", "js", "watch"]);
<% } if (sync) { %>
const browserSync = require("browser-sync");
var _serveTasks = ["html", "js"];
if (_isTaskSet("watch")){
	_serveTasks.push("watch");
}
	//autorefresh server
gulp.task("serve", _serveTasks, function () {
	let _port = 3000;
	browserSync.init(null, {
		server: {
			baseDir: DESTINATION,
			directory: false,
			index: "index.html",
			port: _port
		},
		debugInfo: false,
		open: false
	}, function (err, bs) {
		if (err){
			console.log("Error starting sync server: ", err);
		}
	 });
	browserSync.watch(DESTINATION + "**/*.*").on('change', browserSync.reload);
});
gulp.task("default", ["serve"]);
<% } %>
if (!_isTaskSet("default")) {
	gulp.task("default", ["html", "js"]);
}