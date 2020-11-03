const wordGen = require('../api/wordGen'); // wordgenerator

const Game = require('../../models/Game');
const Player = require('../../models/Player');

module.exports = (io) => (socket) => {
  socket.on('createGame', async (nickName) => {
    try {
      let game = new Game();
      game.words = await wordGen();

      game.players.push({
        socketID: socket.id,
        isPartyLeader: true,
        nickName,
      });

      game = await game.save();

      const gameID = game._id.toString();
      socket.join(gameID); //  created room and joined using primary key

      io.to(gameID).emit('updateGame', game); //updating game for all players with game object
    } catch (err) {
      console.log(err);
    }
  });

  socket.on('joinGame', async ({ gameID: _id, nickName }) => {
    try {
      let game = await Game.findById(_id);
      if (game.isOpen) {
        const gameID = game._id.toString();

        socket.join(gameID); //  joined using primary key

        game.players.push({
          socketID: socket.id,
          isPartyLeader: false,
          nickName,
        });

        game = await game.save();

        io.to(gameID).emit('updateGame', game);
      }
    } catch (err) {
      console.log(err);
    }
  });
};
