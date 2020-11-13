const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const helmet = require('helmet'); //  helps secure express app by adding various HTTP headers
const middlewares = require('./middlewares');

const socketIoHandler = require('./utils/socketIoHandler'); //  socketHandler

const app = express();

//  middlewares
app.use(helmet());

app.get('/', (req, res) => {
  res.send('Express is working!');
});

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log('Server Listening at port ', port);
}); //  returns http object

const io = socketio(server); //  passing express-server object to socketio server

//  connecting to mongodb locally

mongoose.connect(
  'mongodb://mongo/typeracer-clone',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to database!');
  }
);

io.on('connect', socketIoHandler(io));
