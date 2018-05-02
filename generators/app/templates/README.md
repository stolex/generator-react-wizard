React project
=========

To build your debug app type:
	npm start
<% if (listen) { %>Your build files will be auto rebuild after you change files in source folder. <% } if (sync) { %>Open local server on several browsers. When you change source and files are rebuild, all your browsers will be refreshed. Note that this option sometimes don't work for first (fresh) build on Windows!
<% }  %>
To build production files type:
	npm run build