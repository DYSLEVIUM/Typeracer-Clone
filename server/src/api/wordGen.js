let randomWords = require('random-words');

module.exports = function () {
  //  returns an array of words
  return randomWords(Math.random() * 10 + 15);
};
