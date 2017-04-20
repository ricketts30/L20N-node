// app/dal.js

/* ********************************************

 Code	IsError	Title
 1	0	Application Startup
 2	1	Startup Error
 3	1	Culture Code not found
 4	1	Resource not found
 5	1	Generic Error

******************************************** */

const sql = require('mssql');

var connection = "";

function setConnection(c) {  
  connection = c;
}

function appStart(){
  callEventInsert(1, null, null, null, null);
}

function startupError(title, details){
  callEventInsert(2, null, null, title, details);  
}

function cultureNotFound(culture){
  callEventInsert(3, culture, null, null, null);  
}

function resourceNotFound(culture, resource){
  callEventInsert(4, culture, resource, null, null);  
}

function genericError(title, details){
  callEventInsert(5, null, null, title, details);  
}

function callEventInsert(code, culture, resource, error, details) {
	sql.close();
	sql.connect(connection).then(pool => {
		// stored procedure
		return pool.request()
		.input('Code', sql.Int, code)
		.input('DateUtc', sql.DateTime, new Date())
		.input('Culture', sql.NVarChar, culture)
		.input('Resource', sql.NVarChar, resource)
		.input('Error', sql.NVarChar, error)
		.input('Details', sql.NVarChar, details)
		.output('Id', sql.Int)
		.execute('l20n.Event_insert')
	}).then(result => {
		// console.log(result)
                sql.close();
	}).catch(err => {
		console.log(err);
		sql.close();
	});
	sql.on('error', err => {
		console.log(err);
                sql.close();
	});
}

module.exports.setConnection = setConnection;
module.exports.appStart = appStart;
module.exports.startupError = startupError;
module.exports.cultureNotFound = cultureNotFound;
module.exports.resourceNotFound = resourceNotFound;
module.exports.genericError = genericError;