var express=require('express');
var app=express();

var server = require('ws').Server;
var s = new server({ port: 5001 });

var Flickr =require('flickrapi'),
flickrOptions = {
  api_key: "35f004b0cee5c8e425a8d5f5f0dc9c18",
  //secret necessario solo se si vogliono usare metodi authenticated (OAuth)
   secret: "a2af028ce7e6faae"
};


////////////////////////////////////////////////////////////////////////////////
/*
istruzioni:
 lanciare ws_render_server.js
  andare su localhost:3000/showData/:nomeCosaDaCercare
  wait
  
*/
////////////////////////////////////////////////////////////////

var citta = "milan city"
//var latitude= 45.4642035
//var longitude= 9.189981999999986
const radius= 6  // tra i 5 e i 32

var images=[];



function getData(){
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    // we can now use "flickr" as our API object,
    // but we can only call public methods and access public data


      //restituisce solo foto pubbliche
      flickr.photos.search({
        text: citta,
      //  lat: latitude,
      //  lon: longitude,
        radius: radius,
        min_taken_date: 975848456,  //2000 timestamp unix
        max_taken_date: 1512306056, //2017
        per_page: 4,    // numero di img 
        format: "json"


    },function(err, result) {
        if(err) { throw new Error(err); }
        console.log("in photos.search");
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
}



app.get('/showData/',function(req,res){
  console.log("INVIO DATI per milan");
  res.send("INSERIRE CITTA");

})

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

app.get('/showData/:citta',function(req,res){
	citta=req.params.citta;

	getData();
	console.log("DATI RICEVUTI ")

	setTimeout(function(){
	   console.log("INVIO DATI per" +citta +" EJS")	
		res.sendFile("/home/giuppo/Desktop/PROJ-X_RC/BackEnd/webSocket_stuff/render.html");
		s.on('connection',function(ws){

			console.log("[S] connection established with one client with ip "+req.connection.remoteAddress );
      
      ws.isAlive = true;
      ws.on('pong', heartbeat);
			
			
			console.log("sendind data to f.e.");
			//ws.send("<p style='color:blue'> prova di rendering con citta "+ citta+"</p>");
			var strToSend="[IMG]";
      for(i=0;i<images.length;i++){
        strToSend+= images[i].toString()+"@"; //character separator for urls
      } 
      ws.send(strToSend);
      
      ws.on('close',function(ws){
			   console.log("[S-] client disconnected");
			});
        
      });

	}, 2000);


  images=[];
    
});

const interval = setInterval(function ping() {
  s.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 10000);






var server = app.listen(3000,function() {
  
  var host = server.address().address
  var port = server.address().port
 
  console.log("app in ascolto at http://%s:%s",host,port);
  
  })
