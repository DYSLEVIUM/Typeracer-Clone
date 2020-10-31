const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');

// models
const Game = require('./models/Game');

// wordgenerator
const wordGen = require('./wordGen');

const app = express();

const port = process.env.PORT || 3000;

console.log(wordGen);

const server = app.listen(port, () => {
  console.log('Server Listening at port ', port);
}); //  returns http object

const io = socketio(server); //  passing http object to socketio server

//  connecting to mongodb locally
mongoose.connect(
  'mongodb://mongo/typeracer-clone',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to database!');
  }
);

io.on('connect', (socket) => {
  socket.emit('test', 'this is from the server');
});
