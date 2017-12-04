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

var express = require('express');
var OAuth = require('oauth');
var request = require('request');
var bodyParser = require('body-parser');
var session = require('express-session');
//var sys = require('sys');

//var _twitterConsumerKey = "IPbVAysd5FgG8f05raz1xi9YP";
//var _twitterConsumerSecret = "IzYVFgxnt8UZAGipRz2zLP8MPiWLovEafsGEsN8CdhgDaA1WMi";

var app = express();
app.use(bodyParser.urlencoded({extended: false}));

var oauth = new OAuth.OAuth(
		 "https://api.twitter.com/oauth/request_token",
		 "https://api.twitter.com/oauth/access_token",
		 "IPbVAysd5FgG8f05raz1xi9YP",
		 "IzYVFgxnt8UZAGipRz2zLP8MPiWLovEafsGEsN8CdhgDaA1WMi",
		 "1.0",
		 "http://127.0.0.1:5000/auth/twitter/callback",
		 "HMAC-SHA1"
		);


/*app.configure('development', function(){
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
	app.use(express.logger());
	app.use(express.cookieDecoder());
	app.use(express.session());
});
*/

/*app.dynamicHelpers({
	session: function(req, res){
		return req.session;
	}
});
*/

/*app.get('/', function(req, res){
	res.send('Hello World');
});
*/

app.get('/auth/twitter', function(req, res){
	console.log("CIAO");
	oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if(error){
			res.send("Error getting oauth request token");
		}
		else{
			console.log("STRONZO");
			console.log(req);
			//console.log(req.session.oauth)
			res.redirect("https://twitter.com/oauth/authenticate?oauth_token=" + oauthToken);
		}
	});
});

app.get('/auth/twitter/callback', function(req, res, next){
	if(request.session.oauth){
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth_data = req.session.oauth;
		oauth.getOAuthAccessToken(oauth_data.token, oauth_data.token_secret, oauth_data.verifier, function(error, oauth_access_token, oauth_access_token_secret, results){
			if(error) new Error(error);
			else{
				req.session.oauth.access_token = oauth_access_token;
				req.session.oauth.access_token_secret = oauth_access_token_secret;
				console.log(results, req.session.oauth);
				res.send("Authentication succesful!")
			}
		});
	}
	else{
		next(new Error('No OAuth info stored in the session'));
	}
});

app.listen(5000);
