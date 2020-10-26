const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 3000;

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
