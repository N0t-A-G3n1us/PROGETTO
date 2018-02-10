
var request = require('request');
var express=require('express');
var app=express();

var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

////
/*
lanciare server.js
inviare messaggio post contenente campo citta: nome citta
	a localhost:3000/postInfo
oppure usare metodo get
*/
////

console.log("server prova - wikipedia");

var url1 = 'https://en.wikipedia.org/w/api.php?format=json&action=query';
var url2 = '&prop=extracts&exintro=&explaintext=&titles=';
var citta;
let content;

var url = url1 + url2 + citta;

app.post("/postInfo", function (req,res) {
	
  	// res.send("SEI IN GETINFO");
	// console.log("ANANNANA")
  	// res.send('You sent me ' + req.body.citta);
  	citta = req.body.citta;
  	//res.send(citta);
  	url = url1 + url2 + citta;
  	request.get(url, function callback(error, response, body){
  		console.log("in request.get");
		
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

app.get("/getCity/:cit",function(req,res){

	citta=req.params.cit;
	console.log("received citta from get "+ citta)

	url = url1 + url2 + citta;
  	request.get(url, function callback(error, response, body){
  		console.log("in request.get");
		
		var info=JSON.parse(body);
		let page = info.query.pages;
		let pageId = Object.keys(info.query.pages)[0];
		//console.log(page[pageId].extract);
		content = page[pageId].extract;
		res.send(content);
	});

});



var server = app.listen(3000,function() {
	
	var host = server.address().address
	var port = server.address().port
	
	console.log("app in ascolto at http://%s:%s",host,port);
	
});
