var express=require('express')
var app=express()
const port=3000;

var itunes = require('itunes-search')

// http://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html#searching 
// options example: 
// options = { 
//    media: "movie" // options are: podcast, music, musicVideo, audiobook, shortFilm, tvShow, software, ebook, all 
//  , entity: "movie" 
//  , attribute: "movie" 
//  , limit: 50 
//  , explicit: "No" // explicit material 
// } 



app.get('/iSearch/:element',function(req,res){ 
	
	var q_element=req.params.element;

	var options = {
    media: "software"
  	, entity: "software"
  	,country: "us"
  	, limit: 4
	}

	itunes.search( q_element, options, function(response) {
	  // do stuff with 'response' 
	  //console.log(response)
	  res.send(response)


	  for(var i=0; i< response.results.length;i++)
	  	console.log(response.results[i].description+"\n");
	})
});

app.listen(port)
console.log("server started at http://localhost:"+port)
 