// index.js

console.log('L20N-node is starting ...');

const express = require('express');  
var bodyParser = require('body-parser');

console.log('l20n section (starts) ...');
const l20n = require('L20N');  
//console.log(l20n);
// see: 
//   https://github.com/l20n/l20n.js/blob/master/docs/node.md 
//    for details
// load some stuff 
// useIsolating:true will wrap variable bits in special unicode characters
// "Welcome, \u2068Anna\u2069, to \u2068Foo 3000\u2069!"
const ctx = new Intl.MessageContext('en-US', { useIsolating: false });
//
const errors = ctx.addMessages(`
brand-name = Foo 3000
welcome    = Welcome, { $name }, to { brand-name }!
`);

if (errors.length) {
  // handle syntax errors
  // 
}

const welcome = ctx.messages.get('welcome');

console.log('L20N section (ends) ...');

const app = express();
console.log('added express server ...');
const port = 3000;

// use the bodyParser middleware to process the JSON
// parse application/json 
app.use(bodyParser.json())
console.log('added application/json processing ...');

app.post('/', (request, response) => {  
  console.log('/ POST request');
  var output = "nothing found";
  console.log(request.body); 
  if(request.body != null){
  	var thing = ctx.messages.get(request.body.resource);
  	output = ctx.format(thing, request.body.payload);
  }
  response.json({
    msg: output,
    dt: new Date(),
  });
});

app.get('/', (request, response) => {  
  console.log('/ GET request');
  response.send('this app only responds to POST operations at /');
});

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});