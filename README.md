# L20N-node

A small L20N translation server hosted in node.js to enable ASP.NET apps to use L20N translations.

## Documentation

The 'server' listens on port 3000, and only responds to POST requests.  

http://localhost:3000/ POST

with a application/json payload of:

  {
    "culture": "en-GB",
	"resource": "welcome",
	"payload": { "name": "Anfna", "count": "4" }
  }
  
Should return the formatted string in the JSON payload:

  {
    "msg": "Jolly Welcome, Anfna, to Foo 3000 old bean!"
  }

## Release Notes

* Wed 19 Apr 2017 - committed the very basic proof-of-concept server; added ability to read FTL files from folder.

## Much-Needed Features List

* Some kind of error handling gracefulness
* Some modicum of configurability
* ~~ability to read TFL files from folder~~

