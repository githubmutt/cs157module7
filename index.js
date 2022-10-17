const express = require("express");
const socketio = require("socket.io");

const app = express();

// We only use express to serve the main client (index.html)
// Express is NOT needed for socket.io or WebSockets in general

app.use(express.static("public"));

const http = app.listen(3000);


// Code below is socket.io related

// socketio needs a http instance (in this case we are using the instance that express uses internally)
const io = socketio(http); // This automatically creates a static script resource at location /socket.io/socket.io.js

io.on("connection", function(client) {
  console.log("A client has connected");

  client.on("newChat", function(chatMessage) {
    // Emit the chat message to all connected clients
    let newChat = {
      handle: client.x_handle,
      chat: chatMessage
    }

    io.emit("chat", newChat);

    //client.emit(); emitting the event to the client that sent this event
    //io.emit(); emit to all connected clients
    //client.broadcast.emit(); emit to all clients except this client
  })

  client.on("join", function(handle) {
    client.x_handle = handle;
  })

  client.on("disconnect", function() {
    console.log("A client has disconnected");
  })
})