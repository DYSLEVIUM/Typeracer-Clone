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

      io.to(gameID).emit('updateGame', game); //  updating game for all players with game object
    } catch (err) {
      console.log(err);
    }
  });

  socket.on('joinGame', async ({ gameID: _id, nickName }) => {
    try {
      let game = await Game.findById(_id);
      if (game.isOpen && game.isOver) {
        const gameID = game._id.toString();

        let hasPartyLeader = false;
        game.players.forEach((player) => {
          if (player.isPartyLeader === true) hasPartyLeader = true;
        });

        if (hasPartyLeader) {
          socket.join(gameID); //  joined using primary key

          game.players.push({
            socketID: socket.id,
            isPartyLeader: false,
            nickName,
          });

          game = await game.save();

          io.to(gameID).emit('updateGame', game);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on('userLeft', async ({ gameID, playerID }) => {
    try {
      let game = await Game.findById(gameID);
      let player = game.players.id(playerID);

      game.players = game.players.filter((player) => {
        return playerID != player._id;
      });

      game = await game.save();
      io.to(gameID).emit('updateGame', game);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('disconnect', () => {
    socket.disconnect();
  });

  let firstGameDone = false;
  socket.on('startTimer', async ({ gameID, playerID }) => {
    try {
      let countDown = 3;
      let game = await Game.findById(gameID);

      if (firstGameDone) {
        game.words = await wordGen(); //  generating words for next game
        game.players.forEach((player, index) => {
          game.players[index].currWordIndex = 0;
          game.players[index].WPM = 0;
        });
      }

      game.isOver = false;
      game = await game.save();
      io.to(gameID).emit('updateGame', game);

      let player = game.players.id(playerID);

      if (player.isPartyLeader) {
        let timerID = setInterval(async () => {
          if (countDown >= 0) {
            io.to(gameID).emit('timer', { countDown, msg: 'countdown' });
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
    firstGameDone = true;
  });

  socket.on('userInput', async ({ userInput, gameID }) => {
    userInput = userInput.trim();
    try {
      let game = await Game.findById(gameID);

      if (!game.isOpen && !game.isOver) {
        let player = game.players.find(
          (player) => player.socketID === socket.id
        );
        let word = game.words[player.currWordIndex];

        if (word === userInput) player.currWordIndex++;

        if (game.words.length === player.currWordIndex + 1)
          socket.emit('done', { countDown: -1, msg: 'playerEnd' });

        let endTime = new Date().getTime();
        let { startTime } = game;

        player.WPM = calculateWPM(endTime, startTime, player);

        game = await game.save();

        io.to(gameID).emit('updateGame', game);
      }
    } catch (err) {
      console.log(err);
    }
  });

  const startGameClock = async (game) => {
    game.startTime = new Date().getTime();
    game = await game.save();

    let time = game.words.length * (Math.random() + 1) * 3;

    let timerID = setInterval(
      (function gameIntervalFunc() {
        const formatTime = calculateTime(time);

        if (time >= 0) {
          io.to(game._id).emit('timer', {
            countDown: formatTime,
            msg: 'started',
          });

          --time;
        } else {
          (async () => {
            game = await Game.findById(game._id);

            game.isOver = true;
            game.isOpen = true;

            game = await game.save();

            io.to(game._id).emit('done', { countDown: -1, msg: 'gameEnd' });
            io.to(game._id).emit('updateGame', game);
            clearInterval(timerID);
          })();
        }
        return gameIntervalFunc;
      })(),
      1000
    );
    io.to(game._id).emit('updateGame', game);
  };

  const calculateWPM = (endTime, startTime, player) => {
    let numOfWords = player.currWordIndex;
    const timeInSeconds = (endTime - startTime) / 1000;

    const timeInMinutes = timeInSeconds / 60;

    const WPM = numOfWords / timeInMinutes;
    return WPM;
  };

  const calculateTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const allPlayerFinised = (game) => {
    let i = 0;
    game.players.forEach((player) => {
      if (game.words.length === player.currWordIndex) ++i;
    });

    return i === game.players.length;
  };
};
