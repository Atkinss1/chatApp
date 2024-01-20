$(document).ready(() => {

  // define socket to create a new WebSocket on port 3000
  const socket = io('ws://localhost:3500');
  
  const $nameInput = $('#name');
  const $chatRoom = $('#room');
  const $msgInput = $('#message');
  const $activity = $('.activity');
  const $usersList = $('.user-list');
  const $roomList = $('.room-list');
  const $chatDisplay = $('.chat-display');
  
  
  /**
   * Checks if input has a value and sends the message to the server
   * @param {} event
   */
  function sendMessage(e) {
    e.preventDefault();
    if ($msgInput.val() && $nameInput.val() && $chatRoom.val()) {
      socket.emit('message', {
        "name" : $nameInput.val(),
        "text" : $msgInput.val()
      });
      $msgInput.val('');
    }
    $msgInput.focus();
  }

  /**
   * Checks name and room input values
   * @param {} event
   */
  function enterRoom(e) {
    e.preventDefault();
    if ($nameInput.val() && $chatRoom.val()) {
      socket.emit('enterRoom', {
        "name" : $nameInput.val(),
        "room" : $chatRoom.val()
      })
    }
  }
  
  // When user submits name and room

  $('.form-join').on('submit', enterRoom);
  
  // When user submits message

  $('.form-message').on('submit', sendMessage);

  // Listen for keypress to activate "user is typing..."

  $msgInput.on('keypress', () => {
    console.log('keypressed');
    socket.emit('activity', $nameInput.val());
  });

  let activityTimer 
  socket.on('activity', (name) => {
    $activity.text(`${name} is typing...`);
    
    // Clear after 1 second
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
      $activity.text('');
    }, 1000);
  });
  
  // Listen for messages
  
  socket.on('message', (data) => {
    $activity.text('');
    
    const $li = $('<li></li>');
    
    $li.text(data);
    $('ul').append($li);
  })
});
