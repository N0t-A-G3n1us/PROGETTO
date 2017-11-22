var http=require('http');
var express=require('express');



var app=express();



console.log("dovrei essere un server");

app.get("/", function (req,res) {
	
	res.send("Questa pagina è stata creata con express [tachius]");
	
		})
	

var server = app.listen(8081,function() {
	
	var host = server.address().address
	var port = server.address().port
	
	console.log("app in ascolto at http://%s:%s",host,port);
	
	})
