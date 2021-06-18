const { Console } = require("console");
const http = require("http");

const datastore = require("./datastore")
const storage = datastore.storage;

const hostname = 'localhost';
const port = 8080;
var displayStartServerMessage = true;
const server = http.createServer(function(request, response) {
    let serverMessage = "Default server message";
    let jsonString = ''; 

    request.on('data', function(chunk) {
        jsonString += chunk;
    });

    request.on('end', function() {
        switch(request.method) {
            case 'GET':
                console.log("GET method detected");
                serverMessage = storage.getPayerPoints();
                break;

            case 'PUT':
                try {
                    const jsonData = JSON.parse(jsonString);
                    console.log("PUT method detected, parsing PUT data");
                    storage.spendPoints(jsonData);
                }
                catch(e) {
                    console.log(e);
                    response.statusCode(400);
                    serverMessage = `error : ${e.message}`;
                }
                break;

            case 'POST':
                try {
                    const jsonData = JSON.parse(jsonString);
                    console.log("POST method detected, parsing POST data");
                    storage.addTransaction(jsonData);
                    serverMessage = `transaction : sucessful`
                }
                catch(e) {
                    console.log(e);
                    response.statusCode(400);
                    serverMessage = `error : ${e.message}`;                  
                }
                break;

            default: 
                serverMessage = 'error : A proper method wasnt supplied method was supplied';
                console.log(serverMessage);
                response.statusCode(405);
                break;
        }
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(serverMessage));
    });
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



