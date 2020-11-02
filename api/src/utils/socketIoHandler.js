const wordGen = require('./wordGen'); // wordgenerator

const Game = require('../../models/Game');
const Player = require('../../models/Player');

let temp = 0;
module.exports = (io) => (socket) => {
  socket.on('createGame', async (nickName) => {
    try {
      let game = new Game();
      game.words = await wordGen();

      // let player = new Player({
      //   socketID: socket.id,
      //   isPartyLeader: true,
      //   nickName,
      // });

      console.log(socket.id);
      let player = new Player({
        socketID: socket.id,
        isPartyLeader: true,
        nickName,
      });

      game.players.push(player);

      // game = await game.save();
      // const gameID = game._id.toString();

      const gameID = (++temp).toString();

      socket.join(gameID); //  created room and joined using primary key

      io.to(gameID).emit('updateGame', game); //updating game for all players with game object
    } catch (err) {
      console.log(err);
    }
  });
};
