var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/*app.get('/', function(reg, res){
	res.sendFile(__dirname + '/public/index.html');
});*/

//Users in the chat room
var usernames = {};
var users = 0;

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('add user', function(username){
	 // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++users;
	//user login
    socket.emit('login', {
      users: users
    });

	//echo to all users that a new user has connected
	socket.broadcast.emit('user joined', {
      username: socket.username,
      users: users
    });

  });
});

var port = process.env.PORT || 3000;
http.listen(port, function(){
	console.log('listening on ' + port);
});
