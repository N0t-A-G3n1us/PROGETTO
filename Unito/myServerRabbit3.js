//moduli oauth
var OAuth = require('oauth');

//moduli server
var request=require('request');
var express=require('express');
var app=express();
var session = require('express-session');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

//moduli websocket
var server = require('ws').Server;  
var s = new server({ port: 5001 });

//moduli flickr
var Flickr =require('flickrapi'),
flickrOptions = {
  api_key: "35f004b0cee5c8e425a8d5f5f0dc9c18"
  //secret necessario solo se si vogliono usare metodi authenticated (OAuth)
   //,secret: "a2af028ce7e6faae"
};

//moduli itunes
var itunes = require('itunes-search')

//moduli AMQP RabbitMQ
var amqp=require('amqplib/callback_api');


const myPort=5000;

var images; // var contentente url delle imgs flickr
var wikiStr;  // var contenente res della wiki search
var appNames=[]; //var contenente nomi delle app
var appImgs=[]; //var contenente imgs delle app
var appDescs=[];  // var contenente descrizioni delle app

var jsonNames;
var jsonImgs;
var jsonDescs;

var elToSearch="";


/// per RabbitMQ

const nome_ex="log_ex";

  function connessione(err, conn){

  conn.createChannel(function(err, ch) {
    //assert di rabbit 
    ch.assertExchange(nome_ex, 'topic', {durable: false});


    function getData(){


    ////////////////////////////// FLICKR 


     
      Flickr.tokenOnly(flickrOptions, function(error, flickr) {
        // we can now use "flickr" as our API object,
        // but we can only call public methods and access public data


          //restituisce solo foto pubbliche
          flickr.photos.search({
            text: elToSearch,
          //  lat: latitude,
          //  lon: longitude,
            //radius: radius,
            min_taken_date: 975848456,  //2000 timestamp unix
            max_taken_date: 1512306056, //2017
            per_page: 4,    // numero di img 
            format: "json"


        },function(err, result) {
            if(err) { throw new Error(err); }
            ch.publish(nome_ex, "INFO-FLICKR", new Buffer("searching photos for "+ elToSearch+ " through flickr api" ));
            console.log("searching photos for "+ elToSearch+ " through flickr api");
          
            for( i=0; i< result.photos.photo.length;i++){
              var fotoJSON=result.photos.photo[i]
              ch.publish(nome_ex, "INFO-FLICKR",new Buffer(JSON.stringify(fotoJSON)));
              console.log(fotoJSON);
              
              //costruzione url 
              var imgUrl="https://farm"+
                + fotoJSON.farm+".staticflickr.com/"+
                + fotoJSON.server+"/"+
                + fotoJSON.id+"_";
                 
              // secret è esadecimale
              imgUrl+=fotoJSON.secret;
              imgUrl+=".jpg";
              //url costruita
              
              ch.publish(nome_ex, "INFO-FLICKR", new Buffer(imgUrl.toString()));
              console.log(imgUrl);

              images.push(imgUrl.toString());

             




              
            /*  // per avere tutti i formati della foto
              pass={
                api_key: flickrOptions.api_key,
                photo_id: fotoJSON.id
              }
              
              flickr.photos.getSizes(pass,function(e, res){
                if(err) { throw new Error(err); }
                console.log(res.sizes.size[0].source);
              });
              */

          }

        
        })
        })

    /////////////////////////////// WIKIPEDIA

      var url1 = 'https://en.wikipedia.org/w/api.php?format=json&action=query';
      var url2 = '&prop=extracts&exintro=&explaintext=&titles=';
      
      let content;

      var url = url1 + url2 + elToSearch;

      ch.publish(nome_ex, "INFO-WIKI", new Buffer("searching info on  "+ elToSearch + " through wiki api"));
      console.log("searching info on  "+ elToSearch + " through wiki api")

      request.get(url, function callback(error, response, body){ 
        
        ch.publish(nome_ex, "INFO-WIKI", new Buffer("searching desc. for "+ elToSearch+ " through wiki api" ));
        console.log("in request.get");
        
        var info=JSON.parse(body);
        //parsing della stringa json
        var page = info.query.pages;
        var pageId = Object.keys(info.query.pages)[0];
        //console.log(page[pageId].extract);
        content = page[pageId].extract;
        
        wikiStr=content;
      });



    //////////////////////////// ITUNES SEARCH

      ch.publish(nome_ex, "INFO-ITUNES", new Buffer("searching info on  "+ elToSearch + " through itunes search api"));
      console.log("searching info on  "+ elToSearch + " through itunes search api");

      var q_element=elToSearch;

      var itOptions = {
        
        media: "software"
        , entity: "software"
        ,explicit: "No"
        , limit: 4
        ,country: "US"
        
      }

      itunes.search(  q_element,itOptions, function(response) {
        
        
        
        for(var i=0; i< response.results.length;i++){
          var elApp=response.results[i]
          appNames[i] = elApp.trackCensoredName ;
          ch.publish(nome_ex, "INFO-ITUNES", new Buffer("Ottenuto nome da itunes:"+appNames[i]));
          console.log("Ottenuto nome da itunes:"+appNames[i]);
          appImgs[i] = elApp.artworkUrl100;
          ch.publish(nome_ex, "INFO-ITUNES", new Buffer("Ottenuto img da itunes:"+appImgs[i]));
          console.log("Ottenuta img da itunes:"+appImgs[i]);
          appDescs[i] = elApp.description;
          ch.publish(nome_ex, "INFO-ITUNES", new Buffer("Ottenuta desc da itunes")); //eventualmente
          console.log("Ottenuta desc da itunes:");
      
        }
        
      })


      // eventEmitter.emit('data_received');

    } //fine di getData()

    app.get('/get',function(req,res){
         var options ={
        url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        headers: {
          'Authorization' : 'Bearer ' + a_t
        }
      };
      request(options, function callback(error, response, body){
        if(!error && response.statusCode == 200){
          //ch.publish(nome_ex, "INFO-GOOGLE", new Buffer("[TOKEN CORRECT]"));
          console.log("[TOKEN CORRECT]")
          var info = JSON.parse(body);
          //ch.publish(nome_ex, "INFO-GOOGLE", new Buffer(JSON.stringify(info.items[0].summary)));
          console.log(info);
          res.sendFile("/home/giuppo/Desktop/PROJ-X_RC/Unito/feRender.html");
        }
        else{
          ch.publish(nome_ex, "ERRORE", new Buffer("[redirect due to token not correct]"));
          console.log("[redirect due to token not correct]")
          ch.publish(nome_ex, "ERRORE", new Buffer("error num "+response.statusCode));
          console.log("error num "+response.statusCode)
          ch.publish(nome_ex, "ERRORE", new Buffer("ERRORE "+ error));
          console.log("ERRORE "+ error)
          res.redirect('http://localhost:5000/homepage')
          }
        });
      });





        






    /////////////// home for auth

    app.get('/homepage', function(req, res){
        res.sendFile( "/home/giuppo/Desktop/PROJ-X_RC/Unito/fe.html");

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
      ch.publish(nome_ex, "INFO-TWITTER", new Buffer("in auth twitter"));
    	console.log("in auth twitter");
    	oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    		if(error){
          ch.publish(nome_ex, "ERRORE", new Buffer("Error getting oauth request token"));
    			res.send("Error getting oauth request token");
    		}
    		else{
          ch.publish(nome_ex, "INFO-TWITTER", new Buffer("ready to redirect on https://twitter.com/oauth/authenticate?oauth_token=XXX"));
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
    	ch.publish(nome_ex, "INFO-TWITTER", new Buffer("verifying Authentication"));
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
    					res.redirect("http://localhost:"+myPort+"/get");
    				}
    		});
    	}
    	else{
    		next(new Error('No OAuth info stored in the session'));
    	}
    });	





    ///////////			Google          //////////

    var a_t = '';
    app.use(bodyParser.urlencoded({extended: false})); //parser per accettare solo url UTF-8
      //extended: false => accetta solo stringhe o array

    app.get('/auth/google', function(req, res){
      ch.publish(nome_ex, "INFO-GOOGLE", new Buffer("in login google"));
    	console.log("in login google");
    	res.redirect("https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar&response_type=code&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http%3A%2F%2Flocalhost:"+myPort+"/auth/google/callback&client_id=649610250091-2gjifn38g27d7rc84eg35bbkst478a52.apps.googleusercontent.com");
    });

    app.get('/auth/google/callback', function(req, res){
      ch.publish(nome_ex, "INFO-GOOGLE", new Buffer("code taken"));
    	console.log("code taken");
    	var formData = {
    		code: req.query.code,
    		client_id: '649610250091-2gjifn38g27d7rc84eg35bbkst478a52.apps.googleusercontent.com',
    		client_secret: 'SXzNSSJbekgoCIEXWQkjtzlR',
    		redirect_uri: 'http://localhost:'+myPort+"/auth/google/callback",
    		grant_type: 'authorization_code',
    	}
    	request.post({url: 'https://www.googleapis.com/oauth2/v4/token', form: formData}, function optionalCallback(err, httpResponse, body){
    		if(err){
    			return console.error('upload failed: ', err);
    		}
        ch.publish(nome_ex, "INFO-GOOGLE", new Buffer('Upload successful! Server responded with: ' + body));
    		console.log('Upload successful! Server responded with: ', body);
    		var info = JSON.parse(body);
    		//res.send("Got the token: " + info.access_token);
    		res.redirect("http://localhost:5000/get");
    		a_t = info.access_token;
    	});
    });


    app.get('*',function(req,res){

    	res.redirect("/homepage");
    });





    ///////////////////////////////////// WEB SOCKET PART

    s.on('connection',function(ws,req){
        ch.publish(nome_ex, "INFO-WS", new Buffer("[S+] connection established with one client with ip "+ req.connection.remoteAddress ));
    		console.log("[S+] connection established with one client with ip "+ req.connection.remoteAddress );
      

        
        ws.on('message', function incoming(message) {
          ch.publish(nome_ex, "INFO-WS", new Buffer("received: "+ message));
          console.log('\n[S] received: %s\n', message);
          elToSearch=message;
          images=[];
          wikiStr="";
          appNames=[]; //var contenente nomi delle app
          appImgs=[]; //var contenente imgs delle app
          appDescs=[];

          //invio stringa che ricorda qual è l  elemento da cercare richiesto 
          ws.send("[STR] Searching : "+elToSearch)

          getData();
          
          

          
         //  eventEmitter.on('data_received',function(){  
          setTimeout(function(){
            
            
            var imgStr="[IMG]";
            imgStr+=JSON.stringify(images);


            //invio le url delle immagini flickr (TODO DA PASSARE CON JSON)
            ws.send(imgStr);
            
            // invio risultato ricerca con wikipedia

            ws.send("[WIK]"+wikiStr);

            jsonNames=JSON.stringify(appNames);
            jsonDescs=JSON.stringify(appDescs);
            jsonImgs=JSON.stringify(appImgs);


            ws.send("[APN]"+ jsonNames)
            
            ws.send("[API]"+ jsonImgs)

            ws.send("[APD]" + jsonDescs)

            //invio risultato ricerca su itunes per app (con json)


            },1000);


          

          });





        ws.on('close',function(err){
           ch.publish(nome_ex, "INFO-WS", new Buffer(" client disconnected"+err));
    		   console.log("[S-] client disconnected"+err);
    		});
            
    });

  });
 
 }
	

/////////////////////////////// SERVER START PART

var server = app.listen(myPort,function() {
  
  var host = server.address().address
  var port = server.address().port
  
  var rabbit = amqp.connect('amqp://localhost', function(err, conn) {
    if (err != null) return console.error('error in rabbit init: ', err);
    connessione(err,conn);
  });

  console.log("app in ascolto at http://%s:%s",host,port);
  
  })