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

  // Setup listener for message, and send message back as a test
  socket.on('message', data => {
    console.log(`${data}`);
    io.emit('message', `${socket.id.substring(0,5)}: ${data}`);
  })
})