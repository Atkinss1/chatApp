import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { activateUser, userLeavesApp, getUser, getUsersInRoom, getAllActiveRooms, buildMsg} from './helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;
const ADMIN = "Admin";

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const expressServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//! Don't forget to change cors to your ngrok server or local host
const io = new Server(expressServer, {
  cors: {
    origin: 'localhost:3500',
    methods: ['GET', 'POST']
  }
})

// Setup listener for connection
io.on('connection', socket => {
  console.log(`User ${socket.id} connected`);

  // Upon connection - only to user
  
  socket.emit('message', buildMsg(ADMIN, "Welcome to Chat App!"));

  io.emit('roomList', {
    rooms: getAllActiveRooms()
  });

  socket.on('enterRoom', ({ name, room }) => {
     
    // leave previous room
     const prevRoom = getUser(socket.id)?.room

     if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit('message', buildMsg(ADMIN, `${name} has left the room`));
     }

     const user = activateUser(socket.id, name, room);

     // Cannot update previous room useres list until after the state update in activate user
     if (prevRoom) {
      io.to(prevRoom).emit('userList', {
        users: getUsersInRoom(prevRoom)
      });
     };

     //Join room
     socket.join(user.room);

     // To user who joined
     socket.emit('message', buildMsg(ADMIN, `You have joined the ${user.room} chat room`));

     // To everyone else
     socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`));

     // Update user list for room
     io.to(user.room).emit('userList', {
      users: getUsersInRoom(user.room)
     });

     // Update rooms list for everyone
     io.emit('roomList', {
      rooms: getAllActiveRooms()
     });
  });

  // When user disconnects - to all others
  
  socket.on('disconnect', () => {
    // Get users ID
    const user = getUser(socket.id);
    // Then removes user from state
    userLeavesApp(socket.id);
    
    if (user) {
      io.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has left the room`));

      // Update room list
      io.to(user.room).emit('userList', {
        users: getUsersInRoom(user.room)
      });

      io.emit('roomList', {
        rooms: getAllActiveRooms()
      });
    }

    console.log(`User ${socket.id} disconnected`);
  });

  // Listen for message event

  socket.on('message', ({ name, text }) => {
    const room = getUser(socket.id)?.room
    if (room) {
      io.to(room).emit('message', buildMsg(name, text))
    };
  });
  
  // Listen for activity
  
  socket.on('activity', (name) => {
    const room = getUser(socket.id)?.room
    if (room) {
      socket.broadcast.to(room).emit('activity', name);
    };
  });
});