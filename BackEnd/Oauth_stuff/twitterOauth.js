

// codice da : http://codetheory.in/how-to-use-twitter-oauth-with-node-oauth-in-your-node-js-express-application/
/*
lanciare twitterOauth.js
andare a 127.0.0.1/auth/twitter (no localhost)

*/
////////////////////////////////////////////////////////////


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


app.use(session({ secret: 'IzYVFgxnt8UZAGipRz2zLP8MPiWLovEafsGEsN8CdhgDaA1WMi',
				 cookie: { maxAge: 60000 }}))


app.get('/auth/twitter', function(req, res){
	console.log("CIAO");
	oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if(error){
			res.send("Error getting oauth request token");
		}
		else{
			console.log("ready to redirect on https://twitter.com/oauth/authenticate?oauth_token=XXX");			
			req.session.oauth = {
	        token: oauth_token,
	        token_secret: oauth_token_secret
	        
	     	 };
      		console.log(req.session.oauth);

			res.redirect("https://twitter.com/oauth/authenticate?oauth_token=" + oauth_token);
		}
	});
});

app.get('/auth/twitter/callback', function(req, res, next){
	
	console.log("\n"+ "verifying Authentication")


	if(req.session.oauth){
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth_data = req.session.oauth;
		oauth.getOAuthAccessToken(oauth_data.token, 
			oauth_data.token_secret,
			oauth_data.verifier,
			function(error, oauth_access_token, oauth_access_token_secret, results){
			
				if(error) new Error(error);
				else{
					console.log("TWITTER: AUTENTICATO")
					req.session.oauth.access_token = oauth_access_token;
					req.session.oauth.access_token_secret = oauth_access_token_secret;
					console.log(results, req.session.oauth);
					//res.send("Authentication succesful!")
					res.redirect("https://example.com");
				}
		});
	}
	else{
		next(new Error('No OAuth info stored in the session'));
	}
});

app.listen(5000);
