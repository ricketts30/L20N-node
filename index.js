// index.js

const port = 1910;

console.log('launching L20N-node');

var dal = require('./app/dal');
dal.setConnection("mssql://USERNAME:PASSWORD@SERVERNAME/DBNAME");

var server = require('./app/server');
server.setDal(dal);
server.start();

const express = require('express');  
var bodyParser = require('body-parser');
const app = express();

// use the bodyParser middleware to process the JSON
// parse application/json 
app.use(bodyParser.json())

app.post('/', (request, response) => { 
  server.processRequest(request, response);
});

app.get('/', (request, response) => {  
  response.send('this app only responds to POST operations at /');
});

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});