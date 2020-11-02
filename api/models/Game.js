const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  words: [
    {
      type: String,
    },
  ],
  isOpen: {
    type: Boolean,
    default: true,
  },
  isOver: {
    type: Boolean,
    default: false,
  },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
  ],
  startTime: {
    type: Number,
  },
});

module.exports = mongoose.model('Game', GameSchema);
