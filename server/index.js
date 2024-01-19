import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const expressServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const io = new Server(expressServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'? false : 
    ['http://localhost:5500']
  }
})


// Setup listener for connection
io.on('connection', socket => {
  console.log(`User ${socket.id} connected`);

  // Upon connection - only to user
  socket.emit('message', "Welcome to Chat App!");

  // Upon connection - to all others

  socket.broadcast.emit('message', `${socket.id.substring(0,5)}`);

  // Listen for message event

  socket.on('message', data => {
    console.log(`${data}`);
    io.emit('message', `${socket.id.substring(0,5)}: ${data}`);
  })

  // When user disconnects - to all others
  
  socket.on('disconnect', () => {
    socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} has disconnected.`);
  });
  
  // Listen for activity
  
  socket.on('activity', (name) => {
    socket.broadcast.emit('activity', name);
  });
})

