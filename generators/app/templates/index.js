<% if (!cdn) { %>
var React = require("react");
var ReactDOM = require("react-dom");
<% } %>

(function(){
	var HelloWorld = function(){
		return React.createElement(
			"div",
			{id: "hello-world"},
			React.createElement("h1", null, "Hello world")
		);
	};

	window.onload = function(){
		ReactDOM.render(
			React.createElement(HelloWorld),
			document.getElementById("app")
		);
	};

})();