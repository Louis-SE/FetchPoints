const { Console } = require("console");
const http = require("http");

const datastore = require("./datastore")
const storage = datastore.storage;


// This allows setting the IP and Port through the command line.
const hostconfig = require("./hostconfig");
const myArgs = process.argv.slice(2);
const hostname = hostconfig.setServerHostname(myArgs);
const port = hostconfig.setServerPort(myArgs);

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

            // Update a resource
            case 'PUT':
                try {
                    const jsonData = JSON.parse(jsonString);
                    console.log("PUT method detected, parsing PUT data");
                    serverMessage = storage.spendPoints(jsonData);
                }
                catch(e) {
                    console.log(e);
                    serverMessage = {error : e.message};
                }
                break;

            // Create a resource
            case 'POST':
                try {
                    const jsonData = JSON.parse(jsonString);
                    console.log("POST method detected, parsing POST data");
                    serverMessage = storage.addTransaction(jsonData);
                }
                catch(e) {
                    console.log(e);
                    serverMessage = {error : e.message};              
                }
                break;

            default: 
                serverMessage = 'error : A proper method wasnt supplied method was supplied';
                console.log(serverMessage);
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



