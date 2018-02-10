var express=require('express')
var app=express()
const port=3000;

var itunes = require('itunes-search')

//link per semplice guida:
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
  	,entity: "software"
  	,country: "it"
  	, limit: 5
  	, explicit: "No"
	}


	itunes.search( q_element, options, function(response) {
	  // do stuff with 'response' 
		console.log(response)
	 	
		res.setHeader('Content-Type', 'application/json');

	 	res.write(JSON.stringify(response))


	 	// come inviare una seconda ricerca? come ogg. json e non stringa?
	 	var options2={
		     media: "ebook"
		  	,entity: "ebook"
		  	,country: "it"
		  	, limit: 5
		  	, explicit: "No"
			}
		
		itunes.search( q_element, options2, function(response2){

			console.log(response2)
			res.write(JSON.stringify(response2));
			res.end();
		});
		
		

	})

	


	
	


});

app.listen(port)
console.log("server started at http://localhost:"+port)
 