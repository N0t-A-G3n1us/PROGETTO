/*var express = require('express');
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
*/

var OAuth = require('OAuth');
var oauth = new OAuth.OAuth(
	 'https://api.twitter.com/oauth/request_token',
	 'https://api.twitter.com/oauth/access_token',
	 'IPbVAysd5FgG8f05raz1xi9YP',
	 'IzYVFgxnt8UZAGipRz2zLP8MPiWLovEafsGEsN8CdhgDaA1WMi',
	 '1.0A',
	 null,
	 'HMAC-SHA1'
	);
oauth.get(
     'https://api.twitter.com/1.1/trends/place.json?id=934169103526490114',
     '934169103526490114-trZFgqQ7u2j1nfL39tCZQThaLcu5flm',
     '5Q0P2SMcYyLdVrLtCUGhqxqbxoLETSpbi3ScxDl2a67B9',
     function(e, data, res){
     	if(e) console.error(e);
     	console.log(require('util').inspect(data));
     	done();
     }
);

/*var server=app.listen(3000,function(){
	
	var host =server.address().adress
	var port =server.address().port
	
	console.log("Server running at "+host +" "+ port); 
	
	
});
*/