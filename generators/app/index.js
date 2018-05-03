const Generator = require("yeoman-generator");
const Questions = require("./questions");

module.exports = class extends Generator {
	
	constructor(args, opts) {
		super(args, opts);
		
			//object that store all answered questions
		this._response = {
			appName: ""
		};
			//if we need to update package.json, properties that need to be updated are in this object
		this._packageJsonUpdate = {
			name: this.appname
		};
			//npm packages that we need to install
		this._npmPackages = [];
	}
	
	prompting() {
		var _this = this;
		return this.prompt([
				//Questions for user
			Questions.reactSource,
			Questions.packTool,
			Questions.installBabel,
					//Babel specific questions
				Object.assign({
					when: function (answer) {
						return answer.installBabel;
					}
				}, Questions.babelOptions),
			Questions.buildTool,
				//Gulp specific questions
				Object.assign({
					when: function(answer){
						return answer.buildTool === "Gulp";
					}
				}, Questions.gulpListen),
				Object.assign({
					when: function (answer) {
						return answer.gulpListen;
					}
				}, Questions.gulpSync),
			Questions.runNPMInstall
		]).then(function(answers){
			for (let s in answers){
				_this._response[s] = answers[s];
			}
		});
		
	}
	
	writing(){
		this._writeTemplates();
			//update package.json object
		Object.assign(this._packageJsonUpdate, this._writeScripts() );

			//if we don't use react libraries from CDN we need to add them as require modules
		if (this._response.source !== "CDN") {
			this._npmPackages.push("react", "react-dom");
		}
			//add tool for packing (browserify|webpack)
		if (this._response.packTool) {
			this._npmPackages.push(this._response.packTool);
		};

		if (this._response.installBabel) {
			this._npmPackages.push("babel-core", "babel-loader");
			this._npmPackages = this._npmPackages.concat(this._response.babelOptions);
			if (this._response.packTool == "browserify"){
				this._npmPackages.push("babelify");
			}
		};

		if (this._response.buildTool === "Gulp") {
			this._npmPackages.push("gulp");
		};
		if (this._response.gulpSync) {
			this._npmPackages.push("browser-sync");
		};
		
			//if we have more than one package for npm and we will invoke "npm install" manually, update object for package.json
		if (this._npmPackages.length > 0) {
			if (!this._response.runInstall) {
				if (!this._packageJsonUpdate.hasOwnProperty("devDependencies")){
					this._packageJsonUpdate.devDependencies = {};
				};
				this._npmPackages.forEach((element) => this._packageJsonUpdate.devDependencies[element] = "latest");
				this._npmPackages = [];
			}
		}
			//update package.json file
		this.fs.extendJSON(this.destinationPath("package.json"), this._packageJsonUpdate);
	}
	
		//writing/preparing template file
	_writeTemplates(){
		var c_templateObj = {
			title: this.appname,
			scripts: "",
			cdn: false,
			listen: this._response.gulpListen ? true : false,
			sync: this._response.gulpSync ? true : false
		};
			//if user selected to use React from CDN update template variables
		if (this._response.source === "CDN"){
			c_templateObj.scripts = '<script crossorigin src="https://unpkg.com/react/umd/react.production.min.js"></script>\n\t<script crossorigin src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>';
			c_templateObj.cdn = true;
		};
		this.fs.copyTpl(
			this.templatePath("index.html"),
			this.destinationPath("src/index.html"),
			c_templateObj
		);
		this.fs.copyTpl(
			this.templatePath("index.js"),
			this.destinationPath("src/index.js"),
			c_templateObj
		);
		this.fs.copyTpl(
			this.templatePath("README.md"),
			this.destinationPath("README.md"),
			c_templateObj
		);
		if (this._response.installBabel) {
			if (this._response.babelOptions && this._response.babelOptions.length > 0) {
				this.fs.copyTpl(
					this.templatePath(".babelrc"),
					this.destinationPath(".babelrc"),
					{
						presets: this._response.babelOptions.map(function(element){
							return '"' + element.replace(/(babel-)?preset-/, "") + '"'
						}).join(", ")
					}
				);
			}
		}
	}

		//prepare build scripts
	_writeScripts() {
		var c_packageJsonUpdate = {};
		var c_babelReact = false;
			//if user selected preset-react we need to inject extra code in scripts
		if (this._response.installBabel) {
			if (this._response.babelOptions && this._response.babelOptions.length > 0) {
				if (this._response.babelOptions.indexOf("babel-preset-react") != -1){
					c_babelReact = true;
				}
			}
		}
		if (this._response.buildTool === "Standalone"){
			this.fs.copyTpl(
				this.templatePath("scripts/build_standalone.js"),
				this.destinationPath("scripts/build.js"),
				{
					buildType: this._response.packTool,
					babelReact: c_babelReact
				}
			);
			c_packageJsonUpdate.scripts = {
				start: "node scripts/build.js",
				build: 'node scripts/build.js "production"'
			}
		}else {
			this.fs.copyTpl(
				this.templatePath("gulpfile.js"),
				this.destinationPath("gulpfile.js"),
				{
					listen: this._response.gulpListen,
					sync: this._response.gulpSync,
					pack: this._response.packTool,
					babelReact: c_babelReact
				}
			);
				//GULP scripts
			c_packageJsonUpdate.scripts = {
				start: "gulp",
				build: 'gulp build'
			}
		}

		return c_packageJsonUpdate;
	}

	/**
	 * If user selected install npm packages automatically run npm install
	 */
	install(){
		if (this._npmPackages.length > 0){
			if (this._response.runInstall){
				this.npmInstall(this._npmPackages, { "save-dev": true});
			}
		}
	};

	/**
	 * Print end messages
	 */
	end(){
		if (!this._response.runInstall){
			this.log("\nYour project are configured, but before you start it you must to run:\n"
					+ "\tnpm install\n"
					+ "Before you run install you can edit package.json file.\n");
		}
		this.log("\nTo build app run:\n"
				+ "\tnpm start");
	}
	
};