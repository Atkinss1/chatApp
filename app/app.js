// define socket to create a new WebSocket on port 3000
const socket = io('ws://localhost:3500');


/**
 * Checks if input has a value and sends the message to the server
 * @param {} event
 */
function sendMessage(e) {
  e.preventDefault();
  const $input = $('input');
  if ($input.val()) {
    socket.emit('message', $input.val());
    $input.val('');
  }
  $input.focus();
}

$('form').on('submit', sendMessage);

// Listen for messages

socket.on('message', (data) => {
  //! console logs dynamic key: {data} fix later
  console.log(data);
  // create an li element
  const $li = $('<li></li>');
  // set content of li to data ( which is the message from the server );
  $li.text(data);
  $('ul').append($li);
})