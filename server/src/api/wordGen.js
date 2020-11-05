let randomWords = require('random-words');

module.exports = function () {
  //  returns an array of words
  // return randomWords(Math.random() * 25 + 50);
  return randomWords(Math.random() * 1 + 5);
};
