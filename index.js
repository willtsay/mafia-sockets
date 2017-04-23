var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

app.use(express.static(__dirname + '/public'));


var usernames = {};

var roomcounts = {};

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('join room', function(room){
    
    socket.join(room);
    if (!roomcounts[room]){
      roomcounts[room] = 1;
    } else {
      roomcounts[room] +=1;
    }
    var username = usernames[socket.id]
    socket.join(socket.id);
    io.in(socket.id).emit("welcome", "WELCOME TO ROOM: "+ room + " " + username);
    io.in(room).emit("roomcount" , "CURRENTLY " + roomcounts[room] +" IN ROOM " + room);
    // socket.to(room).emit("WELCOME TO ROOM: " + room);
  });

  socket.on('add user', function(username){
    usernames[socket.id] = username;
  });


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});