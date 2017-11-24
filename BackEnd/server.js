/*
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
*/




// https://developers.google.com/identity/protocols/OAuth2WebServer

var express = require('express');
var request = require('request');
var bodyParser = require("body-parser");

var app = express();
var a_t = '';
app.use(bodyParser.urlencoded({ extended: false }));

console.log("lanciato");

// scopes https://developers.google.com/identity/protocols/googlescopes

app.get('/login', function(req, res){
  console.log("in login");
  res.redirect("https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar.metadata.readonly&response_type=code&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=localhost:3000&client_id=649610250091-2gjifn38g27d7rc84eg35bbkst478a52.apps.googleusercontent.com");
});

app.get('/', function(req, res){
  console.log("code taken");
   res.send('the access token is: ' + req.query.code);

  var formData = {
    code: req.query.code,
    client_id: '649610250091-2gjifn38g27d7rc84eg35bbkst478a52.apps.googleusercontent.com',
    client_secret: 'SXzNSSJbekgoCIEXWQkjtzlR',
    redirect_uri: 'http://localhost:3000',
    grant_type: 'authorization_code'
  }


  request.post({url:'https://www.googleapis.com/oauth2/v4/token', form: formData}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
  console.log('Upload successful!  Server responded with:', body);
  var info = JSON.parse(body);
  res.send("Got the token "+ info.access_token);
  a_t = info.access_token;
  a_t = info.access_token;
});

});

// curl -i -H "Authorization: Bearer ya29.GlvvBJnL8yvPkPNAC16hd7C63jTUcECwDJPy5YQ--oIrT8FdQsvFQNpmnEz2zf0K_YlADV8QWOsuYLobYwzG-d03gzAuvohEA95Jaj2vtWa02pPbzyBpwrrxH-vw" "https://www.googleapis.com/calendar/v3/users/me/calendarList"


app.get('/use_token', function(req, res){
  console.log("in use token");
  var options = {
  url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
  headers: {
    'Authorization': 'Bearer '+a_t
    }
  };
  request(options, function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(info);
    res.send(info);
    }
  else {
    console.log(error);
  }
  });

});

app.listen(3000);
