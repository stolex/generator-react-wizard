/**
 * All questions
 */
module.exports = {
	authorName: {
		type: "input",
		name: "author",
		message: "Author name",
		store: true
	},
	reactSource: {
		type: "list",
		name: "source",
		choices: [
			"CDN",
			"Built"	//TODO: add option to use downloaded, but not packed
		],
		message: "How do you want to inject React?"
	},
	reactUI: {
		type: "list",
		name: "ui",
		choices: [
			"React-dom",
			"React-native"
		],
		message: "What UI type you want to use?"
	},
	packTool: {
		type: "list",
		name: "packTool",
		choices: [
			"webpack",
			"browserify"
		],
		message: "What packager you want to use?"
	},
	buildTool: {
		type: "list",
		name: "buildTool",
		choices: [
			"Standalone",
			"Gulp"
		],
		message: "How to build your scripts?"
	},
		gulpListen: {
			type: "confirm",
			name: "gulpListen",
			message: "Should Gulp listen for file changes for autobuild?"
		},
		gulpSync: {
			type: "confirm",
			name: "gulpSync",
			message: "Should Gulp autorefresh browsers on changes?"
		},
	runNPMInstall: {
		type: "confirm",
		name: "runInstall",
		message: "Install all npm libraries?"
	}
}