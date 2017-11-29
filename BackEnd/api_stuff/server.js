
var request = require('request');
var express=require('express');
var app=express();

var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

console.log("dovrei essere un server");

var url1 = 'https://en.wikipedia.org/w/api.php?format=json&action=query';
var url2 = '&prop=extracts&exintro=&explaintext=&titles=';
var citta;
var url;
let content;

var url = url1 + url2 + citta;

app.post("/getInfo", function (req,res) {
	
  	// res.send("SEI IN GETINFO");
	// console.log("ANANNANA")
  	// res.send('You sent me ' + req.body.citta);
  	citta = req.body.citta;
  	//res.send(citta);
  	url = url1 + url2 + citta;
  	request.get(url, function callback(error, response, body){
  		console.log("CIAO");
		var info=JSON.parse(body);
		let page = info.query.pages;
		let pageId = Object.keys(info.query.pages)[0];
		//console.log(page[pageId].extract);
		content = page[pageId].extract;
		res.send(content);
	});
	//console.log(content);
	//res.send(content);
 });



var server = app.listen(3000,function() {
	
	var host = server.address().address
	var port = server.address().port
	
	console.log("app in ascolto at http://%s:%s",host,port);
	
});
