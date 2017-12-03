

var express=require('express');
var app=express();

var request=require('request');

var Flickr =require('flickrapi'),
flickrOptions = {
  api_key: "35f004b0cee5c8e425a8d5f5f0dc9c18",
  //secret necessario solo se si vogliono usare metodi authenticated (OAuth)
   secret: "a2af028ce7e6faae"
};





Flickr.authenticate(flickrOptions, function(error, flickr) {
  // we can now use "flickr" as our API object,
  // but we can only call public methods and access public data


    //restituisce solo foto pubbliche
    flickr.photos.search({
      text: "Milan city",
      authenticated: true

  },function(err, result) {
      if(err) { throw new Error(err); }
      console.log("in photos.search");
      for( i=0; i< result.photos.photo.length;i++){
        var fotoJSON=result.photos.photo[i]
        console.log(fotoJSON);
        /*
        var imgUrl="https://farm"+
          + fotoJSON.farm+".staticflickr.com/"+
          + fotoJSON.server+"/"+
          + fotoJSON.id+"_"+
          + fotoJSON.secret+".jpg"
        console.log(imgUrl);
      */

      
        pass={
          api_key: flickrOptions.api_key,
          photo_id: fotoJSON.id
        }
        
        flickr.photos.getSizes(pass,function(e, res){
          if(err) { throw new Error(err); }
          console.log(res.sizes.size[0].source);
        });
        




    }
     
    // do something with result
  })







});



var server = app.listen(3000,function() {
  
  var host = server.address().address
  var port = server.address().port
  
  console.log("app in ascolto at http://%s:%s",host,port);
  
  })