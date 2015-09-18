var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('.'));

var polls=0;

app.get('/api/currentWeather', function(request, response){
	console.log(polls, polls<5);
	if(polls < 5){
		console.log("sending...empty");
		polls++;
		response.send({});
	}
	else{
		console.log("sending...object");
		response.send({
			temperature: 25,
			sky: "Partly cloudy",
			humid: true
		});
		polls = 0;
	}	
});

app.get('/', function(request, response){
	response.sendFile(path.__currentDir + '/index.html');
});

app.listen(8000, function(){
	console.log("Node.js server started on port 8000...");
});
