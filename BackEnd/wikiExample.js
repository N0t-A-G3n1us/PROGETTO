

var express=require('express');
var request=require('request');
var app=express();

var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));


var url1 = 'https://en.wikipedia.org/w/api.php?format=json&action=query';
var url2 = '&prop=extracts&exintro=&explaintext=&titles=';
var citta = 'Milan';

var url = url1 + url2 + citta;




	
function callback(error,res,body){
	var info=JSON.parse(body);
	let page = info.query.pages;
	let pageId = Object.keys(info.query.pages)[0];
	console.log(page[pageId]);
	let content = page[pageId].extract;
}


	
request.get(url,callback)


var server = app.listen(3000,function() {
	
	var host = server.address().address
	var port = server.address().port
	
	console.log("app in ascolto at http://%s:%s",host,port);
	
	})
