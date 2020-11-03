const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  currWordIndex: {
    type: Number,
    default: 0,
  },
  socketID: {
    type: String,
  },
  isPartyLeader: {
    type: Boolean,
    default: false,
  },
  WPM: {
    type: Number,
    default: -1, //  -1 represents WPM hasn't been calculated
  },
  nickName: {
    type: String,
  },
});

module.exports = mongoose.model('Player', PlayerSchema);
