const { Console } = require("console");
const http = require("http");

// This is the file that will track and process payer data and
// requests done to that data.
const datastore = require("./datastore")
const storage = datastore.storage;

// This allows setting the IP and Port through the command line.
const hostconfig = require("./hostconfig");
const myArgs = process.argv.slice(2);
const hostname = hostconfig.setServerHostname(myArgs);
const port = hostconfig.setServerPort(myArgs);

var displayStartServerMessage = true;
const server = http.createServer(function(request, response) {
    // Server message will contain the response that gets sent
    // back to the client that is making the requst.
    let serverMessage = "Default server message";
    let jsonString = ''; 

    request.on('data', function(chunk) {
        jsonString += chunk;
    });

    request.on('end', function() {
        switch(request.method) {
            // GET is used to get the current balance point balance for each payer.
            case 'GET':
                console.log("GET request detected");
                serverMessage = storage.getPayerPoints();
                break;

            // PUT is used to spend points that have accumulated in the account.
            case 'PUT':
                try {
                    const jsonData = JSON.parse(jsonString);
                    console.log("PUT request detected, parsing request data");
                    serverMessage = storage.spendPoints(jsonData);
                }
                catch(e) {
                    console.log(e);
                    serverMessage = {error : e.message};
                }
                break;

            // POST is used to add transactions from payers which allow the account to accumulate points.
            case 'POST':
                try {
                    const jsonData = JSON.parse(jsonString);
                    console.log("POST request detected, parsing request data");
                    serverMessage = storage.addTransaction(jsonData);
                }
                catch(e) {
                    console.log(e);
                    serverMessage = {error : e.message};              
                }
                break;

            // At this point, either GET, PUT, or POST would not have been detected.
            default: 
                let errorResult = {};
                errorResult.error = "Unsupported Operation";
                errorResult.message = "The request operation that was supplied is not supported by this application";
                errorResult.operation = request.method;
                serverMessage = errorResult;
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



