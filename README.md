# Chat Application README

## Introduction

Welcome to the Chat Application! This project is a simple real-time chat application built using Node.js, Express, and Socket.io. It provides a platform for users to engage in real-time conversations, making it an ideal project for learning and experimenting with websockets.

## Features

- Real-time messaging using Socket.io
- Simple and intuitive user interface
- Easy setup and configuration
- Scalable and extendable for further customization

## Screenshots

![screenshot](./server/public/documents/Screenshot%202024-01-20%20123326.png)
![screenshot](./server/public/documents/Screenshot%202024-01-20%20123432.png)
![screenshot](./server/public/documents/Screenshot%202024-01-20%20123509.png)
![screenshot](./server/public/documents/Screenshot%202024-01-20%20123539.png)

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Installation

1. Clone this repository:

    ```bash
    git clone git@github.com:Atkinss1/chatApp.git
    ```

2. Navigate to the project directory:

    ```bash
    cd chatApp
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Configuration

1. Open the `index.js` file in a text editor of your choice.

2. Locate the following line of code on line 29:

    ```javascript
    const io = new Server
    ```

3. Update the socket address to your server's address or `localhost` if running locally:

    ```javascript
    const io = new Server(expressServer, {
        cors: {
            origin: 'http://your-server-address:your-port',
            methods: ['GET', 'POST'],
        },
    });
    ```

4. Open the `app.js` file in a text editor of your choice.

5. Locate the following line of code on line 4 and update the socket address to your server's address or `localhost` if running locally:

   ```javascript
    const socket = io('http://your-server-address:your-port');
   ```

## Usage

1. Start the server:

    ```bash
    npm start
    ```

2. Open your web browser and navigate to `http://your-server-address:your-port`.

3. Enter a username and room, then start chatting!


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- I'd like to acknowledge [Dave Gray](https://www.youtube.com/@DaveGrayTeachesCode) for doing a tutorial at YouTube on Socket.io, it has made it easier to get a basic understanding of the Socket.io library. 

- This project was inspired by the need for a basic real-time chat application for learning purposes.

Feel free to reach out if you have any questions or need further assistance. Happy chatting!
