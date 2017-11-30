var express = require('express');
var app=express();


app.get("/login",function(req,res){
	
	var red1="/oauth/request_token";
	var red2="&oauth_callback=https%3A%2F%2Fexample.com";
	var red="https://api.twitter.com/oauth/authenticate?oauth_token=w3BrsiYP7cHOg25mFJ3iKRGnqysAvcdehGHBYdeY207ts";
	console.log("redirection on " +red);
	res.redirect(red);
	
	
	})
	
app.get("/",function(req,res){
	
	console.log("redirected from sign in succesful");
	
	
	})

app.get('*', function(req, res){
    res.redirect('/login');
});	
	

var server=app.listen(3000,function(){
	
	var host =server.address().adress
	var port =server.address().port
	
	console.log("Server running at "+host +" "+ port); 
	
	
	})
