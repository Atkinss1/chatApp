$(document).ready(() => {

  //! Don't forget to change this address to your new ngrok server OR localhost
  const socket = io('https://c35e-96-52-110-15.ngrok-free.app');
  
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
  
  // Listen for messages
  
  socket.on('message', (data) => {
    $activity.text('');
    const { name, text, time } = data;
    const $li = $('<li></li>');
    $li.addClass('post');

    // If name equals name value given, post will align left, else align right

    if (name === $nameInput.val()) $li.attr('post', 'post post--left');
    if (name !== $nameInput.val() && name !== 'Admin') $li.attr('post', 'post post--right')
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
  })
  
  let activityTimer 
  socket.on('activity', (name) => {
    $activity.text(`${name} is typing...`);
  });

  socket.on('userList', ({ users }) => {
    showUsers(users);
  });
  
  socket.on('roomList', ({ rooms }) => {
    showRooms(rooms);
  });
    
    // Clear after 1 second
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
      $activity.text('');
    }, 1000);
    
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
});
  
  