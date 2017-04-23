$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms

  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $roomInput = $('.roomInput');
  var $loginPage = $('.login.page');
  var $lobbyPage = $('.lobby.page');
  var $gamePage = $('.game.page');
  var $gameMessage = $('.game.message');
  var $gameBroadcast = $('.game.broadcast');

  var username = false;
  var connected = false;
  var $currentInput = $usernameInput.focus();

  var socket = io();

  socket.on("welcome", function(message){
    $("div.welcome").text(message);
    // set something to some message.
  })

  socket.on("roomcount", function(message){
    $("div.broadcast").text(message);
  })


  function setUsername () {
    username = cleanInput($usernameInput.val().trim());
    // $loginPage.fadeOut();
    // $lobbyPage.show();

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $lobbyPage.show();
      $roomInput.focus();

      socket.emit('add user', username);
    //   // $loginPage.off('click');
    //   // $currentInput = $inputMessage.focus();

    //   // Tell the server your username
    //   // socket.emit('add user', username);
    }
  }

  function joinRoom () {
    room = cleanInput($roomInput.val().trim());
    if (room) {
      $lobbyPage.fadeOut();
      $gamePage.show();
      socket.emit('join room', room);
    }
  }



  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    // if (!(event.ctrlKey || event.metaKey || event.altKey)) {
    //   $currentInput.focus();
    // }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username){

        joinRoom();
      } else {
  	    setUsername();      
      }
    }
  });


});


