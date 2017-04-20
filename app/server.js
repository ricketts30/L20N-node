// app/server.js

const fs = require('fs');
const l20n = require('L20N');

var dal;

function setDal(d) {  
  dal = d;
}

var dict = {};
var dictErrors = {};
var dictErrorCount = 0;

function start(){
  dal.appStart();

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

}

function processRequest(request, response){
  console.log('== == == ==');
  var output = "nothing found";
  if(request.body != null){
    var cc = request.body.culture;
    var ctx = dict[cc];
    if(ctx == null){
      dal.cultureNotFound(cc);
    }else{
      var thing = dict[cc].messages.get(request.body.resource);
      if(thing == null){
        dal.resourceNotFound(cc, request.body.resource);
      }else{
  	output = ctx.format(thing, request.body.payload);
      }
    }
  }
  response.json({
    msg: output
  });
}

module.exports.setDal = setDal;
module.exports.start = start;
module.exports.processRequest = processRequest;

