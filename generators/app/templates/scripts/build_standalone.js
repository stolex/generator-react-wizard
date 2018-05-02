const path = require('path');
const fs = require("fs");

var _mode = "development";

if (process.argv.length > 2) {
	_mode = process.argv[2];
};

//create build directory if not exist
if (!fs.existsSync("./build")) {
	fs.mkdirSync("build");
};
//copy html files from root
fs.readdir("./src/", function (err, files) {
	if (!err && files.length > 0) {
		files.forEach(function (filename) {
			if (filename.search(/.htm(l?)$/) !== -1) {
				fs.copyFile("./src/" + filename, "./build/" + filename, function () { });
			}
		});
	}
});

<% if (buildType == "webpack") { %>
	//webpack code
const webpack = require("webpack");
webpack({
	mode: _mode, //"production" | "development" | "none"
	
	entry: "./src/index.js",
	
	output: {
		path: path.resolve(__dirname, "../build"),
		filename: "index.js",
	}
}, function (err, stats) {
	if (err) {
		console.log(err);
	}
});
<% } %>

<% if (buildType == "browserify") { %>
	//browserify code
const browserify = require("browserify");
browserify("./src/index.js").bundle().pipe(fs.createWriteStream("./build/index.js"));
<% } %>