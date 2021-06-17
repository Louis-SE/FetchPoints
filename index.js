const http = require("http");

const hostname = 'localhost';
const port = 8080;

var displayStartServerMessage = true;

const server = http.createServer(function(request, response) {
    
}).listen(port, hostname);


if(displayStartServerMessage) {
    console.log(`Server running at http://${hostname}:${port}/\n`);
}