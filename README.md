# React Wizard
is Yeoman template to help users for **ReactJS** initial project setup. I'm trying to not use bunch of libraries that won't be used. Through an interactive guide, the user can set whether he wants to use the version from CDN or not, how to pack the final file (Browserify or Webpack), to use Gulp or just npm scripts, etc.

# Questions:
## How do you want to inject React?
- CDN - React (and ReactDOM) library will be injected in HTML page from official React CDN.  Latest version will be used, so if you need specific version please update `src/index.html` file
- Built - React libraries will be downloaded as npm module, and used in final release with *require*.
## What packager you want to use?
Select library to pack source files to final Javascript release:
- Webpack  
- Browserify
## How to build your scripts?
- Standalone - with this option we will create script(s) in `./scripts/` folder that will be used for build. In this case you must to execute those scripts manually
- Gulp - will configure `gulpfile.js` - main Gulp configuration file with all tasks that user can execute.
## Should Gulp listen for file changes for autobuild?
this question will be asked only if Gulp is selected.  If you select it whenever you change source files, Gulp will execute task for autobuild.
## Should Gulp autorefresh browsers on changes?
this question will be asked only if Gulp is selected. If you set `Y` [browser-sync](https://www.npmjs.com/package/browser-sync) server will be started on default port (3000). To change port open `gulpfile.js` and on "serve" task replace `_port` variable. You can open this local web address on several browsers, and on each change, all browsers will be refreshed.
## Install all npm libraries?
Your project is generated, and npm config file (package.json) is set. If you don't need to change it manually you can select `Y`. If you want to update something, change module versions (by default latest stable will be loaded), you need to run `npm install` manually.
