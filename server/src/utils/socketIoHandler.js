const wordGen = require('../api/wordGen'); // wordgenerator

const Game = require('../../models/Game');

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

  socket.on('startTimer', async ({ gameID, playerID }) => {
    try {
      let countDown = 5;
      let game = await Game.findById(gameID);
      let player = game.players.id(playerID);

      if (player.isPartyLeader) {
        let timerID = setInterval(async () => {
          if (countDown >= 0) {
            io.to(gameID).emit('timer', { countDown, msg: 'Starting Game' });
            --countDown;
          } else {
            game.isOpen = false;
            game = await game.save();

            io.to(gameID).emit('updateGame', game);

            startGameClock(game);
            clearInterval(timerID);
          }
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  });

  const startGameClock = async (game) => {
    game.startTime = new Date().getTime();
    game = await game.save();

    let time = 1;
    let timerID = setInterval(
      (function gameIntervalFunc() {
        const formatTime = calculateTime(time);
        if (time >= 0) {
          io.to(game._id).emit('timer', {
            countDown: formatTime,
            msg: 'Time Remaining',
          });
          --time;
        } else {
          (async () => {
            let endTime = new Date().getTime();
            let { startTime } = game;
            game.isOver = true;

            game.players.forEach((player, index) => {
              if (player.WPM === -1) {
                game.players[index].WPM = calculateWPM(
                  endTime,
                  startTime,
                  player
                );
              }
            });

            game = await game.save();
            io.to(game._id).emit('updateGame', game);
            clearInterval(timerID);
          })();
        }
        return gameIntervalFunc;
      })(),
      1000
    );
  };

  const calculateWPM = (endTime, startTime, player) => {
    let numOfWords = player.currentWordIndex || 0;
    const timeInSeconds = (endTime - startTime) / 1000;

    const timeInMinutes = timeInSeconds / 60;

    const WPM = Math.floor(numOfWords / timeInMinutes);
    return WPM;
  };

  const calculateTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
};
