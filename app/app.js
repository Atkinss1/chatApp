// define socket to create a new WebSocket on port 3000
const socket = new WebSocket('ws://localhost:3000');


/**
 * Checks if input has a value and sends the message to the server
 * @param {} event
 */
function sendMessage(e) {
  e.preventDefault();
  const input = document.querySelector('input');
  if (input.value) {
    socket.send(input.value);
    input.value = '';
  }
  input.focus();
}

document.querySelector('form').addEventListener('submit', sendMessage);

// Listen for messages

socket.addEventListener('message', ({ data }) => {
  // create an li element
  const li = document.createElement('li');
  // set content of li to data ( which is the message from the server );
  li.textContent = data;
  document.querySelector('ul').appendChild(li);
})