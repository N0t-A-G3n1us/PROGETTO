

var express=require('express');
var app=express();
var request=require('request');
var Flickr =require('flickrapi'),
	flickrOptions = {
		api_key: "35f004b0cee5c8e425a8d5f5f0dc9c18",
        secret: "a2af028ce7e6faae"
	};

var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

var url1="https://en.wikipedia.org/w/api.php?action=query&titles=";

var citta="Milan";
var url2="&prop=revisions&rvprop=content&format=json";
var url=url1+citta+url2




	
Flickr.tokenOnly(flickrOptions, function(error, flickr) {
  // we can now use "flickr" as our API object,
  // but we can only call public methods and access public data

  flickr.photos.search({
  text: "Milan city"
}, function(err, result) {
  if(err) { throw new Error(err); }
  // do something with result
})


});



/*

flickr.people.getPhotos({
  api_key: flickrOptions.api_key
  user_id: 
  authenticated: true,
  page: 1,
  per_page: 100
}, function(err, result) {
  
  //  This will now give all public and private results,
  //  because we explicitly ran this as an authenticated call
  
});

*/

var server = app.listen(3000,function() {
	
	var host = server.address().address
	var port = server.address().port
	
	console.log("app in ascolto at http://%s:%s",host,port);
	
	})