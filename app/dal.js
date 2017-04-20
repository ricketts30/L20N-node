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

function genericError(title, details){
  callEventInsert(5, null, null, title, details);  
}

function callEventInsert(code, culture, resource, error, details) {
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
	}).catch(err => {
		console.log(err);
	});
	sql.on('error', err => {
		console.log(err);
	});
}

module.exports.setConnection = setConnection;
module.exports.genericError = genericError;
module.exports.appStart = appStart;