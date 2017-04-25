var express = require('express');
var app = express();
var cors = require('cors');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });
app.use(cors());
app.use(express.static(__dirname + '/public'));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// FOR A ROOM. 
// https://p7lrmho5n7.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=mafia
//  


// get expected number of players

// GFAME STATE LINK 

// https://p7lrmho5n7.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Game_state 

// what data structures do i want to use?

var roles5 = ["Villager","Werewolf","Werewolf", "Seer", "Villager"];
var roles7 = ["Villager","Villager","Villager","Werewolf", "Seer", "Doctor", "Werewolf"];
var roles9 = ["Villager","Villager","Villager","Werewolf", "Seer", "Doctor", "Werewolf", "Villager", "Villager"];
var roles11 = ["Villager","Villager","Villager","Werewolf", "Seer", "Doctor", "Werewolf", "Werewolf", "Villager", "Villager", "Villager"];

var usernames = {};

var roomcounts = {};

var roomMax = {};

var roomroles = {};

var rooms = {};

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('join room', function(data){
    // check if room is setup?
    var room = data["room"];
    var max = data["max"];

    // hard coded, remove when role #'s dynamic;
    max = 7;
    
    socket.join(room);
    if (!rooms[room]){
      rooms[room] = {};
      rooms[room].pc = 1; 
      rooms[room].max = max;
      // later add logic for deciding how many roles
      rooms[room].remainingRoles = roles7.slice();
    } else {
      rooms[room].pc +=1;
    }
    if (rooms[room].pc <= rooms[room].max){
      var role = rooms[room].remainingRoles[Math.floor(Math.random()*max)];
    }

    var username = usernames[socket.id]
    socket.join(socket.id);
    io.in(socket.id).emit("welcome", "WELCOME TO ROOM: "+ room + " " + username);
    io.in(room).emit("roomcount" , "CURRENTLY " + rooms[room].pc +" IN ROOM " + room);
    // send data back for client to post

    var roleData = {};
    roleData["Role"] = role;
    roleData["GameId"] = room;
    roleData["Player"] = rooms[room].pc+20;
    



    io.in(socket.id).emit("assign role", roleData); // tell client what role they got..  
    // now roll the role?

    // socket.to(room).emit("WELCOME TO ROOM: " + room);



  });

  socket.on('add user', function(username){
    usernames[socket.id] = username;
  });


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});