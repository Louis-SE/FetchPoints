const { Console } = require("console");
const http = require("http");

const hostname = 'localhost';
const port = 8080;

var displayStartServerMessage = true;

const server = http.createServer(function(request, response) {

    let jsonString = ''; 

    request.on('data', function(chunk) {
        console.log("data found");
        jsonString += chunk;
    });

    request.on('end', function() {
        switch(request.method) {
            case 'GET':
                console.log("GET detected");
                break;

            case 'PUT':
                try {
                    const jsonData = JSON.parse(jsonString);
                    console.log("parsing PUT data");
                }
                catch(e) {
                    console.log(e);
                }
                break;

            case 'POST':
                try {
                    const jsonData = JSON.parse(jsonString);
                    console.log("parsing POST data");
                }
                catch(e) {
                    console.log(e);
                }
                break;
        }
    });

    //response.end(method);
}).listen(port, hostname);

server.on('error', function(e) {
    displayStartServerMessage = false;
    console.log("The http server could not be created\n");
    console.log(e);
    server.close();
});

if(displayStartServerMessage) {
    console.log(`Server running at http://${hostname}:${port}/\n`);
}



