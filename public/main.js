var $window;
var $usernameInput;
var $loginPage;
var $chatPage;
var socket;

var connected = false;
var username;
$(document).ready(function(){
		
		$window = $(window);
		$usernameInput = $('#usr'); //Username input field
		$loginPage = $('.login.page'); //Login page
		$chatPage = $('.chat.page'); //chat page
		
		 socket = io();
		 //user enters a message by clicking Send
		 $('form').submit(function(){
			sendMessage();
			return false;
			/*socket.emit('chat message', $('#m').val());
			$('#m').val('');
			return false;*/
		 });
		 //display the message
		 socket.on('chat message', function(msg){
			log(msg);
		 });
		 
		 // Whenever the server emits 'login', log the login message
		  socket.on('login', function (data) {
			connected = true;
			// Display the welcome message
			var message = "Welcome to Socket.IO Chat – ";
			log(message);
			log("there are " + data.users + " participants");
			//addParticipantsMessage(data);
		  });
		  
		  //server displays user joined
		  socket.on('user joined', function (data) {
			log(data.username + ' joined');
		  });
		  
		  //server displayed user left
		  socket.on('user left', function (data) {
			log(data.username + ' left');
		  });

		  
		 // Keyboard events
		 $window.keydown(function (event) {
			
			// When the client hits ENTER on their keyboard
			if (event.which === 13) {
			  if(username){ //sends a message with Enter
				sendMessage();
			  } else{ //Login with username
				setUsername();
			  }
			}
		 });
});

function log(message){
	$('#messages').append($('<li class="list-group-item">').text(message));
	$('.scrollable-list').scrollTop($('.scrollable-list')[0].scrollHeight);
}

// Sets the client's username
  function setUsername () {
    username = $usernameInput.val().trim();

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      //$currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
  }
  
//Send a chat message from the user's input box
function sendMessage(){
	var message = $('#chatmsg').val();
	
	//if its a non empty message and the user is connected then send it
	if(message && connected){
		socket.emit('chat message', username + ": " + message);
		$('#chatmsg').val(''); //set the input to empty
	}
}



