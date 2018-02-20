var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');


var app = express();
var a_t = '';
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
	console.log("ciao");
	res.redirect("https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http://localhost:3000/login&response_type=code&client_id=247107126228-gvlrlvp265blbmcdb92sgglf4iom6gk4.apps.googleusercontent.com");
});

app.get('/login', function(req, res){
	console.log("code taken");
	var formData = {
		code: req.query.code,
		client_id: '247107126228-gvlrlvp265blbmcdb92sgglf4iom6gk4.apps.googleusercontent.com',
		client_secret: 'jvuxMiEEMNDcS4RmNF0cvOeY',
		redirect_uri: 'http://localhost:3000/login',
		grant_type: 'authorization_code',
	}
<<<<<<< Updated upstream
	request.post({url: 'https://www.googleapis.com/oauth2/v4/token', form: formData}, function optionalCallback(err, httpResponse, body){
		if(err){
			return console.error('upload failed: ', err);
		}
		console.log('Upload successful! Server responded with: ', body);
		var info = JSON.parse(body);
		/*if(info.access_token==undefined){
			res.redirect("http://www.google.it/");
		}
		*/
		//else{
=======
	
	request.post({url: 'https://accounts.google.com/o/oauth2/token', form: formData}, function optionalCallback(err, httpResponse, body){
		if(err){
			return console.error('upload failed: ', err);
		}
		var info = JSON.parse(body);
<<<<<<< Updated upstream
		console.log('Upload successful! Server responded with: ', body);
=======
		

>>>>>>> Stashed changes
>>>>>>> Stashed changes
		res.send("Got the token: " + info.access_token);
		a_t = info.access_token;
		//}
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

app.listen(3000);