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
      let countDown = 3;
      let game = await Game.findById(gameID);
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

        if (word === userInput) {
          player.currWordIndex++;
          if (player.currWordIndex !== game.words.length) {
            let endTime = new Date().getTime();
            let { startTime } = game;

            player.WPM = calculateWPM(endTime, startTime, player);

            game = await game.save();
            io.to(gameID).emit('updateGame', game);
          } else {
            let endTime = new Date().getTime();
            let { startTime } = game;

            player.WPM = calculateWPM(endTime, startTime, player);

            game = await game.save();

            socket.emit('done');
            io.to(gameID).emit('updateGame', game);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  const startGameClock = async (game) => {
    game.startTime = new Date().getTime();
    game = await game.save();

    let time = game.words.length * 5;
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
            let endTime = new Date().getTime();
            let { startTime } = game;
            game.isOver = true;

            game.players.forEach((player, index) => {
              if (player.WPM === 0) {
                game.players[index].WPM = calculateWPM(
                  endTime,
                  startTime,
                  player
                );
              }
            });

            game = await game.save();
            socket.emit('done');
            io.to(game._id).emit('updateGame', game);
            clearInterval(timerID);
          })();
        }
        return gameIntervalFunc;
      })(),
      1000
    );

    game = await game.save();
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
};
