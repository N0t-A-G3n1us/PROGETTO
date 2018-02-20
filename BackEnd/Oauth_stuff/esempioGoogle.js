/*
 * example OAuth and OAuth2 client which works with express v3 framework
 *
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var config = require('./config.js');
console.log(config.PORT);

var sys = require('util');
var oauth = require('oauth');


var app = express();

// all environments

/*
app.configure(function(){
  app.set('port', config.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({  secret: config.EXPRESS_SESSION_SECRET }));
  app.use(function(req, res, next){
    res.locals.user = req.session.user;
     next();
    });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
*/

app.get('/', function(req, res){
  res.render('index')
});


var _twitterConsumerKey = config.TWITTER_CONSUMER_KEY;
var _twitterConsumerSecret = config.TWITTER_CONSUMER_SECRET;
console.log("_twitterConsumerKey: %s and _twitterConsumerSecret %s", _twitterConsumerKey, _twitterConsumerSecret);

function consumer() {
  return new oauth.OAuth(
    'https://api.twitter.com/oauth/request_token', 
    'https://api.twitter.com/oauth/access_token', 
     _twitterConsumerKey, 
     _twitterConsumerSecret, 
     "1.0A", 
     config.HOSTPATH+'/sessions/callback', 
     "HMAC-SHA1"
   );
}

app.get('/sessions/connect', function(req, res){
  consumer().getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){ //callback with request token
    if (error) {
      res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
    } else { 
      sys.puts("results>>"+sys.inspect(results));
      sys.puts("oauthToken>>"+oauthToken);
      sys.puts("oauthTokenSecret>>"+oauthTokenSecret);
 
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      res.redirect("https://api.twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);    
    }
  });
});


app.get('/sessions/callback', function(req, res){
  sys.puts("oauthRequestToken>>"+req.session.oauthRequestToken);
  sys.puts("oauthRequestTokenSecret>>"+req.session.oauthRequestTokenSecret);
  sys.puts("oauth_verifier>>"+req.query.oauth_verifier);
  consumer().getOAuthAccessToken(
    req.session.oauthRequestToken, 
    req.session.oauthRequestTokenSecret, 
    req.query.oauth_verifier, 
    function(error, oauthAccessToken, oauthAccessTokenSecret, results) { //callback when access_token is ready
    if (error) {
      res.send("Error getting OAuth access token : " + sys.inspect(error), 500);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      consumer().get("https://api.twitter.com/1.1/account/verify_credentials.json", 
                      req.session.oauthAccessToken, 
                      req.session.oauthAccessTokenSecret, 
                      function (error, data, response) {  //callback when the data is ready
        if (error) {
          res.send("Error getting twitter screen name : " + sys.inspect(error), 500);
        } else {
          data = JSON.parse(data);
          req.session.twitterScreenName = data["screen_name"];  
          req.session.twitterLocaltion = data["location"];  
          res.send('You are signed in with Twitter screenName ' + req.session.twitterScreenName + ' and twitter thinks you are in '+ req.session.twitterLocaltion)
        }  
      });  
    }
  });
});

/*
var _googleAppID = config.GOOGLE_APP_ID;
var _googleAppSecret = config.GOOGLE_CONSUMER_SECRET;
console.log("_googleAppID: %s and _googleAppSecret %s", _googleAppID, _googleAppSecret);

function consumer2() {
  return new oauth.OAuth2(
     _googleAppID, 
     _googleAppSecret, 
     'https://accounts.google.com/o', 
      '/oauth2/auth', 
      '/oauth2/token', 
      null
   );
}

app.get('/sessions/connect2', function(req, res){
  res.redirect( consumer2().getAuthorizeUrl({
       'scope': 'https://www.googleapis.com/auth/calendar.readonly',
       'response_type': 'code',
       'redirect_uri': config.HOSTPATH+'/sessions/oauth2'
  }));
});

app.get('/sessions/oauth2', function(req, res){
  req.session.oauth2AuthorizationCode = req.query['code'];
  consumer2().getOAuthAccessToken( req.session.oauth2AuthorizationCode, 
         {'grant_type': 'authorization_code',
          'redirect_uri': config.HOSTPATH+'/sessions/oauth2'},
    function(error, access_token, refresh_token, results){ //callback when access_token is ready
      if (error) {
        res.send("Error getting OAuth access token : " + sys.inspect(error), 500);
      } else {    
        req.session.oauth2AccessToken = access_token;
        req.session.oauth2RefreshToken = refresh_token;
        consumer2().get( //use the access token to request the data
          'https://www.googleapis.com/calendar/v3/users/me/calendarList',
          req.session.oauth2AccessToken, 
          function(error,data) { //callback when data is returned
            if (error) {
              res.send("Error getting data : " + sys.inspect(error), 500);
            } else {
              data = JSON.parse(data);
              console.log('we have data ' + sys.inspect(data) );
              res.send("Google says "+ sys.inspect(data));
            };          
          }
        );
      };  
    }
  );
});
*/

app.listen(5000);