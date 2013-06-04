var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function (request, response){
	
	var file_path = ""
	var mimes = {
		'css':  'text/css',
		'js':   'text/javascript',
		'htm':  'text/html',
		'html': 'text/html',
	}
	
	var url_request = url.parse(request.url).pathname;  					
	var tmp  = url_request.lastIndexOf(".")
	var ext  = url_request.substring((tmp + 1))
	
	//set path of index page
	if(url_request == "/" || url_request == "/index_file.html"){
		file_path = "index_file.html"
	}

	console.log(url_request);

	//set path of static pages
	if (ext == 'css' || ext == 'js' || ext == 'htm' || ext == 'html' || ext == 'png' || ext == 'php' || ext == 'gif'){
		file_path = url_request.replace("/", "");
	}

	//load needed pages and static files
	fs.readFile(file_path, function(error, data){
		if(error){
			response.writeHeader(500, {"Content-Type": "text/html"});  
			response.write("<h1>Internal Server Error!</h1>");    
		}
		else{
			response.writeHeader(200, {"Content-Type": mimes[ext]});  
			response.write(data);
		}

		response.end();  
	});
	
}); 

// have socket io listen to server
var sockets = io.listen(server);

//listening to connection event
sockets.on('connection', function (socket){
	//listening to send message event
	socket.on('send_message', function (message){
		//trigger display message event in all open sockets
		socket.broadcast.emit('display_message', message);
	});

	//listening to ninja hide event
	socket.on('send_ninja1_right', function (x){
		//trigger display message event in all open sockets
		socket.broadcast.emit('display_ninja1_right', x);
	});

	//listening to ninja hide event
	socket.on('send_teleport', function (){
		console.log('send_telew')
		//trigger display message event in all open sockets
		socket.broadcast.emit('display_teleport');
	});


	// //listening to ninja hide event
	// socket.on('send_ninja1_vertical', function (x, y){
	// 	//trigger display message event in all open sockets
	// 	socket.broadcast.emit('display_ninja1_vertical', x, y);
	// });

});

server.listen(8000);

console.log('Server running in localhost port 8000');