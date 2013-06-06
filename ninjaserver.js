var http = require('http');
var fs = require('fs');
var io = require('socket.io');
var url = require('url');
var querystring = require('querystring');
var session = require('sessions');
var user_session = new session();

//create the server and load static files
var server = http.createServer(function (request, response){
	user_session.httpRequest(request, response, function(errors, session){
		//content types per file extension
		var mimes = {
			'css':  'text/css',
			'js':   'text/javascript',
			'html': 'text/html'
		}
		
		//get file extention of requested url
		var url_request = url.parse(request.url).pathname;  					
		var tmp  = url_request.lastIndexOf(".");
		var ext  = url_request.substring((tmp + 1));

		//get file path to load
		file_path = url_request.replace("/", "");
	
		if(url_request == "/"){
			file_path = "index_file.html";
		}

		//load files depending on the file path and file extension
		fs.readFile(file_path, function(error, contents){
			response.writeHeader(200, {"Content-Type": mimes[ext]});  
			response.end(contents);  
		});
	});
}).listen(8000);

//have socket io listen to the created server
var sockets = io.listen(server);

sockets.set('authorization', function (handshake_data, accept){	
	
	if(handshake_data.headers.cookie){
		user_session.httpRequest(handshake_data, accept, function(errors, session){
			handshake_data.session = session;
		});
	}

	accept(null, true);
});

//store usernames of online users
var online_users = [];

//listens to conenection event
sockets.on('connection', function (socket){

	//generate random username and user set session
	socket.username = Math.floor((Math.random()*1000)+1);
	socket.handshake.session.set('user_session', {
		'is_login': true, 
		'username': socket.username
	});
	
	//add the new user to the online_users array
	online_users.push(socket.handshake.session.get('user_session'));		

	// listens for a new browser instance to assign a username, and pass list of online users
	socket.on('get_username', function (){
		console.log('get_username');
		console.log(socket.username);
		username_array = [socket.username, online_users];
		sockets.sockets.emit('display_username', username_array);
	});

	////// ALTERNATE CODE /////
	//update list of online users
	// sockets.sockets.emit('get_all_users', online_users ); 
	// end of Alternate Code

	//listens to a user logging out 
	socket.on('disconnect', function (){
		online_users.forEach(function (user){
			if(user.username == socket.username){
				user.is_login = false;
				//update list of online users
				username_array = [socket.username, online_users];
				sockets.sockets.emit('display_username', username_array)
			}
		});
	});

	//listen if a user sends a message
	socket.on('send_message', function(data){
		form_data = querystring.parse(data);
		
		//sends and update message to other users chat box
		sockets.sockets.emit('display_message', {
			'username':socket.username, 
			'message':form_data.chat_message 
		}); 
	});

	// listens to and sends the creation of a new player
	socket.on('send_new_player', function (username){
		socket.broadcast.emit('display_new_player', username);
	});

	// listening to ninja move event
	socket.on('send_ninja1_left', function (pos_array){
		//trigger display message event in all open sockets
		socket.broadcast.emit('display_ninja1_left', pos_array);
	});
	socket.on('send_ninja1_right', function (pos_array){
		//trigger display message event in all open sockets
		socket.broadcast.emit('display_ninja1_right', pos_array);
	});
	socket.on('send_ninja1_up', function (pos_array){
		//trigger display message event in all open sockets
		socket.broadcast.emit('display_ninja1_up', pos_array);
	});
	socket.on('send_ninja1_down', function (pos_array){
		//trigger display message event in all open sockets
		socket.broadcast.emit('display_ninja1_down', pos_array);
	});

	// listens to and sends the creation of a new player
	socket.on('send_new_snowball', function (username){
		socket.broadcast.emit('display_new_snowball', username);
	});

}); // end of sockets.on connection

