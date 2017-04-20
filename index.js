// index.js

console.log('launching L20N-node');

const express = require('express');  
var bodyParser = require('body-parser');
var fs = require('fs');

var dal = require('./app/dal');

dal.setConnection("mssql://USERNAME:PASSWORD@SERVERNAME/DBNAME");

dal.appStart();

//dal.genericError("the titles", "the details");

const l20n = require('L20N');  
//console.log(l20n);
// see: 
//   https://github.com/l20n/l20n.js/blob/master/docs/node.md 
//    for details
// load some stuff 
// useIsolating:true will wrap variable bits in special unicode characters
// "Welcome, \u2068Anna\u2069, to \u2068Foo 3000\u2069!"

var dict = {};
var dictErrors = {};
var dictErrorCount = 0;

// normally we don't do stuff synchronously in node.js
// ... but it's OK for one-time-only setup activities.
var files = fs.readdirSync('./locales/');
for(var i = 0, l = files.length; i < l; i++){
	console.log('file:  ' + files[i]);
	// work out the culture
	var split = files[i].split('.');
	var cultureCode = split[0];
	var fileText = fs.readFileSync('./locales/' + files[i], 'utf8');
	var mCtx = new Intl.MessageContext(cultureCode, { useIsolating: false });
	dict[cultureCode] = mCtx;
	var dictError = mCtx.addMessages(fileText);
	dictErrorCount += dictError.length;
	dictErrors[cultureCode] = dictError;
}

if(dictErrorCount > 0){
	// handle the syntax errors
	console.log(`!!! ERROR COUNT IS ${dictErrorCount} !!!`);
}

const app = express();
const port = 1910;

// use the bodyParser middleware to process the JSON
// parse application/json 
app.use(bodyParser.json())

app.post('/', (request, response) => {  
  var output = "nothing found";
  if(request.body != null){
    var cc = request.body.culture;
    var ctx = dict[cc];
    var thing = dict[cc].messages.get(request.body.resource);
  	output = ctx.format(thing, request.body.payload);
  }
  response.json({
    msg: output
  });
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