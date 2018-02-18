var express=require('express');
var app=express();

var server = require('ws').Server;
var s = new server({ port: 5001 });

const myport=5000;

var Flickr =require('flickrapi'),
flickrOptions = {
  api_key: "35f004b0cee5c8e425a8d5f5f0dc9c18",
  //secret necessario solo se si vogliono usare metodi authenticated (OAuth)
   secret: "a2af028ce7e6faae"
};


/////////////////////////////////     ISTRUZIONI
/*
istruzioni:
 lanciare ws_render_server.js
  andare su localhost:3000/showData/:nomeCosaDaCercare
  wait
  
*/
////////////////////////////////////////////////////////////////


////////////////////////////// FLICKR 


//var latitude= 45.4642035
//var longitude= 9.189981999999986
//const radius= 6  // tra i 5 e i 32

var images;

var elToSearch="";

function getData(){
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
        
        console.log("searching photos through flickr api");
        
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


app.get('/get',function(req,res){
  	res.sendFile("/home/giuppo/Desktop/PROJ-X_RC/Unito/feRender.html");
});


///////////////////////////////////// WEB SOCKET PART

s.on('connection',function(ws,req){

		console.log("[S+] connection established with one client with ip "+ req.connection.remoteAddress );
  

    
    ws.on('message', function incoming(message) {
      console.log('\n[S] received: %s\n', message);
      elToSearch=message;
    
      ws.send("[STR] Searching : "+elToSearch)

      getData();
      
      setTimeout(function(){  
        var strToSend="[IMG]";
        
        for(i=0;i<images.length;i++){
          strToSend+= images[i].toString()+"@"; //character separator for urls
          }
        ws.send(strToSend);
        
        },3000);

      });





    ws.on('close',function(err){
		   console.log("[S-] client disconnected"+err);
		});
        
});

	



    




/////////////////////////////// SERVER START PART

var server = app.listen(myport,function() {
  
  var host = server.address().address
  var port = server.address().port
 
  console.log("app in ascolto at http://%s:%s",host,port);
  
  })