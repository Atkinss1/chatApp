
$(document).ready(() => {

  //! Don't forget to change this address to your new ngrok server OR localhost
  const socket = io('http://localhost:3500');
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
    return socket.emit('enterRoom', {
      "name" : $nameInput.val(),
      "room" : $chatRoom.val()
    })
  }
}

/**
 * Emits activity event and sends nameInput value
 */
function handleKeyPress() {
  socket.emit('activity', $nameInput.val());
};

/**
 * Takes in an Object with name, text, time and passes it into generated HTML message post
 * @param {object} data
 */
function displaymessage(data) {
  $activity.text('');
  const { name, text, time } = data;
  const $li = $('<li></li>');
  $li.addClass('post');

  if (name === $nameInput.val()) $li.attr('class', 'post post--right');
  if (name !== $nameInput.val() && name !== 'Admin') $li.attr('class', 'post post--left')
  if (name !== 'Admin') {
    $li.html(
    `<div class="post__header ${name === $nameInput.val() ? 'post__header--user' : 'post__header--reply'}">
    <span class="post__header--name">${name}</span>
    <span class="post__header--time">${time}</span>
    </div>
    <div class="post__text">${text}</div>`
    );
  } else {
    $li.html(`<div class="post__text">${text}</div>`);
  }
  $chatDisplay.append($li);
  
  // Continue to scroll down as messages append

  const $chatDisplayHeight = $chatDisplay.prop('scrollHeight');

  $chatDisplay.prop('scrollTop', $chatDisplayHeight);
};

/**
 * Takes in users name and emits '{name} is typing' to others
 * @param {string} name 
 */

function displayActivity(name) {
  let activityTimer 
  
  $activity.text(`${name} is typing...`);
  
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    $activity.text('');
  }, 1000);
}

/**
 * Display users
 * @param {*} users 
 */
function showUsers(users) {
  $usersList.text('');
  if ($usersList) {
    $usersList.html(`<em>Users in ${$chatRoom.val()}: </em>`);
    users.forEach((user, i) => {
      $usersList.append(`${user.name}`)
      if (users.length > 1 && i !== users.length - 1) {
        $usersList.append(', ');
      }
    })
  }
}

/**
 * Display room list
 * @param {string} rooms 
 */
function showRooms(rooms) {
  $roomList.text('');
  if ($roomList) {
    $roomList.html('<em>Active Rooms: </em>');
    rooms.forEach((room, i) => {
      $roomList.append(`${room}`)
      if (rooms.length > 1 && i !== rooms.length - 1) {
        $roomList.append(', ');
      }
      
    })
  }
}
   
  // EVENTS

  $('.form-join').on('submit', enterRoom);
  
  $('.form-message').on('submit', sendMessage);
  
  $msgInput.on('keypress', handleKeyPress);
  
  socket.on('message', (data) => displaymessage(data))    
  
  socket.on('activity', (name) => displayActivity(name));

  socket.on('userList', ({ users }) => showUsers(users));
  
  socket.on('roomList', ({ rooms }) => {
    showRooms(rooms);});

});
  