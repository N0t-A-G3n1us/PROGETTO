
var express=require('express');
var app=express();

var http = require('http');

var path = require('path');

const port=3000;

const directory="/home/giuppo/Desktop/PROJ-X_RC/BackEnd";


app.get('/',function(req,res){
		
		res.sendFile(path.join(directory+ '/index.html'));
			
		
	
	})
	
app.get('/submitted',function(err,cit){
	
	
	})
	
app.listen(port,function(err){
	if(err)
		console.log('error occured in listening',err);
	
	console.log("server is listening on port " + port);
	})


//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
