const http = require("http");

const hostname = 'localhost';
const port = 8080;

var displayStartServerMessage = true;

const server = http.createServer(function(request, response) {
    var method;
    if(request.method === 'GET') {
        method = "GET detected";
    }
    else if(request.method === 'PUT') {
        method = "PUT detected"
    }
    else if(request.method === 'POST') {
        method = "POST detected"
    }
    else if(request.method === 'DELETE') {
        method = "DELETE detected"
    }
    else {
        method = "The request method wasn't defined"
    }

    response.end(method);
}).listen(port, hostname);


server.on('error', function(e) {
    sendServerStartMessage = false;
    console.log("The http server could not be created\n");
    console.log(e);
    server.close();
});

if(displayStartServerMessage) {
    console.log(`Server running at http://${hostname}:${port}/\n`);
}