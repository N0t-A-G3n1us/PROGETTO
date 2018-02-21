var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var OAuth = require('oauth');
var session = require('express-session');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));

const myPort=5000;



/////////////// home for auth

app.get('/homepage', function(req, res){
    res.sendFile( "/Users/Dvide/Desktop/progettoreti/Unito/fe.html");

});




////////////////	Twitter


var oauth = new OAuth.OAuth(
		 "https://api.twitter.com/oauth/request_token",
		 "https://api.twitter.com/oauth/access_token",
		 "IPbVAysd5FgG8f05raz1xi9YP",
		 "IzYVFgxnt8UZAGipRz2zLP8MPiWLovEafsGEsN8CdhgDaA1WMi",
		 "1.0",
		 "http://127.0.0.1:"+myPort+"/auth/twitter/callback",
		 "HMAC-SHA1"
		);



app.use(session({ secret: 'IzYVFgxnt8UZAGipRz2zLP8MPiWLovEafsGEsN8CdhgDaA1WMi',
				 cookie: { maxAge: 60000 }}))


app.get('/auth/twitter', function(req, res){
	console.log("in auth twitter");
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
					req.session.oauth.access_token = oauth_access_token;
					req.session.oauth.access_token_secret = oauth_access_token_secret;
					console.log(results, req.session.oauth);
					//res.send("Authentication succesful!")
				}
		});
	}
	else{
		next(new Error('No OAuth info stored in the session'));
	}
});





///////////			google          //////////

var a_t = '';
app.use(bodyParser.urlencoded({extended: false}));

app.get('/auth/google', function(req, res){
	console.log("in login google");
	res.redirect("https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/drive.metadata.readonly&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http://localhost:"+myPort+"/auth/google/callback&response_type=code&client_id=649610250091-2gjifn38g27d7rc84eg35bbkst478a52.apps.googleusercontent.com");
});

app.get('/auth/google/callback', function(req, res){
	console.log("code taken");
	var formData = {
		code: req.query.code,
		client_id: '649610250091-2gjifn38g27d7rc84eg35bbkst478a52.apps.googleusercontent.com',
		client_secret: 'SXzNSSJbekgoCIEXWQkjtzlR',
		redirect_uri: 'http://localhost:'+myPort,
		grant_type: 'authorization_code',
	}
	request.post({url: 'https://accounts.google.com/o/oauth2/token', form: formData}, function optionalCallback(err, httpResponse, body){
		if(err){
			return console.error('upload failed: ', err);
		}
		console.log('Upload successful! Server responded with: ', body);
		var info = JSON.parse(body);
		//res.send("Got the token: " + info.access_token);
		res.redirect(formData.redirect_uri+"/home_logged?from=google");
		a_t = info.access_token;
	});
});

app.get('/use_token', function(req, res){
	var options ={
		url: 'https://www.googleapis.com/drive/v2/files',
		headers: {
			'Authorization' : 'Bearer ' + a_t
		}
	};
	request(options, function callback(error, response, body){
		if(!error && response.statusCode == 200){
			var info = JSON.parse(body);
			console.log(info);
			res.send(info);
		}
		else{
			console.log(error);
		}
	});
});

app.get('/home_logged',function(req,res){
	res.send("You logged successfully from: "+ req.query.from);

});


app.get('*',function(req,res){

	res.redirect("/homepage");
});

app.listen(myPort);
console.log("started server at http://localhost:"+myPort)