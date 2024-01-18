const ws = require('ws');
const server = new ws.Server({ port: '3000' });


// Setup listener for connection
server.on('connection', socket => {
  // Setup listener for message, and send message back as a test
  socket.on('message', message => {
    socket.send(`${message}`);
    console.log(`${message}`);
  })
})