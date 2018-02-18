//moduli server
var request=require('request');
var express=require('express');
var app=express();

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


const myport=5000;

/////////////////////////////////     ISTRUZIONI
/*
istruzioni:
 lanciare ws_render_server.js
  andare su localhost:3000/showData/:nomeCosaDaCercare
  wait
  
*/
////////////////////////////////////////////////////////////////





//var latitude= 45.4642035
//var longitude= 9.189981999999986
//const radius= 6  // tra i 5 e i 32

var images; // var contentente url delle imgs flickr
var wikiStr;  // var contenente res della wiki search
var appNames=[]; //var contenente nomi delle app
var appImgs=[]; //var contenente imgs delle app
var appDescs=[];  // var contenente descrizioni delle app

var jsonNames;
var jsonImgs;
var jsonDescs;

var elToSearch="";

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

    request.get(url, function callback(error, response, body){ // INFO SU MODULO REQUEST
      
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
    ,country: "us"
    , limit: 4
  }

  itunes.search( q_element, itOptions, function(response) {
    

    for(var i=0; i< response.results.length;i++){
      var elApp=response.results[i]
      appNames[i] = elApp.trackCensoredName ;
      appImgs[i] = elApp.artworkUrl100;
      appDescs[i] = elApp.description;
    }
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
      
      //invio stringa che ricorda qual è l  elemento da cercare richiesto 
      ws.send("[STR] Searching : "+elToSearch)

      getData();
      
      jsonNames=JSON.stringify(appNames);
      jsonDescs=JSON.stringify(appDescs);
      jsonImgs=JSON.stringify(appImgs);

      setTimeout(function(){  
        var imgStr="[IMG]";
        
        for(i=0;i<images.length;i++){
          imgStr+= images[i].toString()+"@"; //character separator for urls
          }
        
        //invio le url delle immagini flickr (TODO DA PASSARE CON JSON)
        ws.send(imgStr);
        
        // invio risultato ricerca con wikipedia

        ws.send("[WIK]"+wikiStr);

        ws.send("[APN]"+ jsonNames)
        
        ws.send("[API]"+ jsonImgs)

        ws.send("[APD]" + jsonDescs)

        //invio risultato ricerca su itunes per app (con json)


        },2000);


      

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