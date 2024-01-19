$(document).ready(() => {

  // define socket to create a new WebSocket on port 3000
  const socket = io('ws://localhost:3500');
  
  const $activity = $('.activity');
  const $msgInput = $('input');
  
  
  /**
   * Checks if input has a value and sends the message to the server
   * @param {} event
   */
  function sendMessage(e) {
    e.preventDefault();
    if ($msgInput.val()) {
      socket.emit('message', $msgInput.val());
      $msgInput.val('');
    }
    $msgInput.focus();
  }
  
  $('form').on('submit', sendMessage);
  
  // Listen for messages
  
  socket.on('message', (data) => {
    $activity.text('');
    // create an li element
    const $li = $('<li></li>');
    // set content of li to data ( which is the message from the server );
    $li.text(data);
    $('ul').append($li);
  })
  
  $msgInput.on('keypress', () => {
    console.log('keypressed');
    socket.emit('activity', socket.id.substring(0, 5));
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
});
