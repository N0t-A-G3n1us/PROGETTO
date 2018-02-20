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
  api_key: "35f004b0cee5c8e425a8d5f5f0dc9c18",
  //secret necessario solo se si vogliono usare metodi authenticated (OAuth)
   secret: "a2af028ce7e6faae"
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


      images=[];
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
            ch.publish(nome_ex, "INFO", new Buffer("searching photos for "+ elToSearch+ " through flickr api" ));
            console.log("searching photos for "+ elToSearch+ " through flickr api");
          
            for( i=0; i< result.photos.photo.length;i++){
              var fotoJSON=result.photos.photo[i]
              console.log(fotoJSON);
              
              var imgUrl="https://farm"+
                + fotoJSON.farm+".staticflickr.com/"+
                + fotoJSON.server+"/"+
                + fotoJSON.id+"_";
                 
                 // secret è esadecimale
              imgUrl+=fotoJSON.secret;
              imgUrl+=".jpg";
              
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

      
      console.log("searching info on  "+ elToSearch + " through wiki api")

      request.get(url, function callback(error, response, body){ 
        
        ch.publish(nome_ex, "INFOWIKI", new Buffer("searching photos for "+ elToSearch+ " through flickr api" ));
        console.log("in request.get");
        
        var info=JSON.parse(body);
        let page = info.query.pages;
        let pageId = Object.keys(info.query.pages)[0];
        //console.log(page[pageId].extract);
        content = page[pageId].extract;
        
        wikiStr=content;
      });



    //////////////////////////// ITUNES SEARCH

      
      console.log("searching info on  "+ elToSearch + " through itunes search api")

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
          console.log("Ottenuto nome da itunes:"+appNames[i]);
          appImgs[i] = elApp.artworkUrl100;
          console.log("Ottenuta img da itunes:"+appImgs[i]);
          appDescs[i] = elApp.description;
          console.log("Ottenuta desc da itunes:" +"...");
      
        }
        
      })


      // eventEmitter.emit('data_received');

    } //fine di getData()

    app.post('/get',function(req,res){

      	res.sendFile("/home/giuppo/Desktop/PROJ-X_RC/Unito/feRender.html");
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
    		redirect_uri: 'http://localhost:'+myPort+"/use_token",
    		grant_type: 'authorization_code',
    	}
    	request.post({url: 'https://www.googleapis.com/oauth2/v4/token', form: formData}, function optionalCallback(err, httpResponse, body){
    		if(err){
    			return console.error('upload failed: ', err);
    		}
    		console.log('Upload successful! Server responded with: ', body);
    		var info = JSON.parse(body);
    		//res.send("Got the token: " + info.access_token);
    		res.redirect(formData.redirect_uri);
    		a_t = info.access_token;
    	});
    });

    app.get('/use_token', function(req, res){
    	console.log("in use token")
      var options ={
    		url: 'https://www.googleapis.com/drive/v2/files',
    		headers: {
    			'Authorization' : 'Bearer ' + a_t
    		}
    	};
    	request(options, function callback(error, response, body){
    		if(!error && response.statusCode == 200){
    			var info = JSON.parse(body);

    			console.log("TOKEN VERIFIED"+ "\n"+info);
    			res.redirect("localhost:5000/get");
    		}
    		else{
    			console.log(error);
          res.redirect("localhost:5000/homepage")
    		}
    	});
    });

    app.get('/home_logged',function(req,res){
    	res.send("You logged successfully from: "+ req.query.from);

    });


    app.get('*',function(req,res){

    	res.redirect("/homepage");
    });





    ///////////////////////////////////// WEB SOCKET PART

    s.on('connection',function(ws,req){

    		console.log("[S+] connection established with one client with ip "+ req.connection.remoteAddress );
      

        
        ws.on('message', function incoming(message) {
          console.log('\n[S] received: %s\n', message);
          elToSearch=message;
          images=[];
          appNames=[]; //var contenente nomi delle app
          appImgs=[]; //var contenente imgs delle app
          appDescs=[];
          //invio stringa che ricorda qual è l  elemento da cercare richiesto 
          ws.send("[STR] Searching : "+elToSearch)

          getData();
          
          

          
         //  eventEmitter.on('data_received',function(){  
          setTimeout(function(){
            var imgStr="[IMG]";
            jsonNames=JSON.stringify(appNames);
            jsonDescs=JSON.stringify(appDescs);
            jsonImgs=JSON.stringify(appImgs);
            
            //vecchio imgaes
            //for(i=0;i<images.length;i++){
             // imgStr+= images[i].toString()+"@"; //character separator for urls
             // }
            
            imgStr+=JSON.stringify(images);


            //invio le url delle immagini flickr (TODO DA PASSARE CON JSON)
            ws.send(imgStr);
            
            // invio risultato ricerca con wikipedia

            ws.send("[WIK]"+wikiStr);

            ws.send("[APN]"+ jsonNames)
            
            ws.send("[API]"+ jsonImgs)

            ws.send("[APD]" + jsonDescs)

            //invio risultato ricerca su itunes per app (con json)


            },1000);


          

          });





        ws.on('close',function(err){
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
    if (err != null) bail(err);
    connessione(err,conn);
  });
 
  console.log("app in ascolto at http://%s:%s",host,port);
  
  })