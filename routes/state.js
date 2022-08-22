const guessService = require('../guess/dbService');
const userService = require('../user/dbService');
const wordService = require('../word/dbService');
const { setGuessColors, getDayWord } = require('./utility/common');

const getUserState = async (req, res) => {
  const user = await userService.getUser(req.headers.uuid);
  if (user.error) {
    return res.send(user);
  }
  const userGuessesWordIds = (await guessService.getByUser(user)).map(
    (g) => g.wordId
  );
  const userGuesses = (await wordService.findByIds(userGuessesWordIds)).map(
    (w) => w.content
  );
  let dayWord = getDayWord(user);
  // Color guesses
  let allColoredWords = [];
  userGuesses.forEach((guess) => {
    allColoredWords.push(setGuessColors(dayWord, guess));
  });
  return res.send(allColoredWords);
};

module.exports = getUserState;
