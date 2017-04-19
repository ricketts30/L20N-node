# L20N-node

A small L20N translation server hosted in node.js to enable ASP.NET apps to use L20N translations.

## Documentation

The 'server' listens on port 3000, and only responds to POST requests.  

http://localhost/ POST

with a application/json payload of:

  {
    "culture": "en-GB",
	"resource": "welcome",
	"payload": { "name": "Anfna", "count": "4" },
	"timeZone": null
  }
  
Should return the formatted string in the JSON payload:

  {
    "msg": "Welcome, Anfna, to Foo 3000!",
    "dt": "2017-04-19T18:00:41.894Z"
  }

## Release Notes

* Wed 19 Apr 2017 - committed the very basic proof-of-concept server.

## Much-Needed Features List

* ability to read TFL files from folder
* Some kind of error handling gracefulness

