# Fetch Points
A simple Node.js server coded in JavaScript that handles HTTP requests that contain JSON data.

## Description
In a Fetch-like application, users are allowed to submit receipts to accumulate points that they can then spend on rewards. This application mimics a portion of this behavior by allowing requests to be sent to the application so that it can track these points. Points are tracked seperately for each company using a point amount and and a timestamp of when the purchase was made. When a request is sent to the server to spend points, the points with the oldest timestamp are spent first, and a message is returned reporting the amount of points consumed by each company.

## Technologies Used
Node.js v14.17.0

Postman for Windows Version 8.6.2

## Running the Application
To run the application, download and install the latest version of Node.js.
https://nodejs.org/en/download/

A program like Postman is needed to send the HTTP requests to the application.
https://www.postman.com/downloads/

Download the five project files (index.js, hostconfig.js, datastore.js, payer.js, and package.json) into the same directory. Open a command line in the created directory and run the following command to start the application:

```
node index.js [hostname] [port]
```

If the hostname and port arguments are omitted, then the server will start using the default hostname: '127.0.0.1' and port: '8080'. A confirmation message will be displayed confirming that the server has started.  
With the server running, use postman to send JSON requests to the server. Start Postman and in the URL field, enter the address the server was started on. The address entered should be formatted as 'hostname:port' so when using the default hostname and port, it would be '127.0.0.1:8080' or 'localhost:8080'.  
In the Body tab of Postman, select 'raw', and from the data type drop down menu, select 'JSON'. In the text field, enter in a properly formatted JSON string and then click send. The server will return a response depending on the request type and JSON string sent to the server.


The following request types are supported: GET, POST, and PUT

#### GET
When sending a GET request, simply sending the request on its own will return the points accumulated so far for each payer.

Example response from the server: 
```
{
    "DANNON": 800,
    "UNILEVER": 200,
    "MILLER COORS": 1500
}
```

#### POST
When sending a POST request, a JSON string needs to be supplied the contains a payer, points, and timestamp attribue. This is used to add point accumulations to the user's account. Both negative and positive point values can be sent through POST requests. If the payer doesn't have enough points to handle a negative point request, an error message will be returned.

Example response to the server:
```
{
    "payer": "DANNON",
    "points": 1000,
    "timestamp": "2020-11-02T13:00:00Z"
}
```

Example response from the server: 
```
{
    "status": "Success",
    "message": "POST transaction successful"
}
```


Example response to the server:
```
{
    "payer": "DANNON",
    "points": -2000,
    "timestamp": "2020-11-02T13:00:00Z"
}
```

Example response from the server: 
```
{
    "error": "Insufficient Points",
    "payerName": "DANNON",
    "currentPointBalance": 1000
}
```

#### PUT
When sending a PUT requst, a point attribue and point value need to be sent. This request will attempt to spend points from the account as long as enough points are in the account to  completely satisfy the request. If there aren't enough points, an error message will be returned. If there are enough points in the account to meet the request, then points will be removed from payers, starting with the oldest points accrued on the account. A list of payers will be returned along with how many points were consumed from each payer.

Example response to the server:
```
{ "points": 3000 }
```

Example response from the server: 
```
[
    {
        "payer": "DANNON",
        "points": -1300
    },
    {
        "payer": "UNILEVER",
        "points": -200
    },
    {
        "payer": "MILLER COORS",
        "points": -1500
    }
]
```


Example response to the server:
```
{ "points": 3000 }
```

Example response from the server: 
```
{
    "error": "Not Enough Points",
    "message": "There are not enough points in this account to process this request",
    "currentPointBalance": 1000
}
```