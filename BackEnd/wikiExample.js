

var express=require('express');
var request=require('request');
var app=express();

var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

var url1="https://en.wikipedia.org/w/api.php?action=query&titles=";

var citta="Milan";
var url2="&prop=revisions&rvprop=content&format=json";
var url=url1+citta+url2




	
	function callback(error,res,body){
		var info=JSON.parse(body)
		console.log(info.query.pages);
		}


	
request.get(url,callback)


var server = app.listen(3000,function() {
	
	var host = server.address().address
	var port = server.address().port
	
	console.log("app in ascolto at http://%s:%s",host,port);
	
	})
