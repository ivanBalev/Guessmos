const userService = require('../user/dbService');
const wordService = require('../word/dbService');
const guessService = require('../guess/dbService');
const getDayWord = require('../utils/getDayWord');

const guess = async (req, res) => {
  const word = await wordService.findOneByContent(req.body.word);
  // TODO: Error handling middleware
  if (word.error) {
    return res.send(word);
  }

  const user = await userService.getUser(req.headers.uuid);
  if (user.error) {
    return res.send(user);
  }
  // TODO: Aggregate function
  const userGuessesWordIds = (await guessService.getByUser(user)).map(
    (g) => g.wordId
  );

  const userGuesses = (await wordService.findByIds(userGuessesWordIds)).map(
    (w) => w.content
  );
  let dayWord = await getDayWord(user);

  console.log('DAYWORD IS: ' + dayWord);

  const validateGuessResult = user.validateGuess(userGuesses, dayWord, word);
  if (validateGuessResult?.error) {
    return res.send(validateGuessResult);
  }

  const guess = await guessService.create(user.id, word);
  const coloredGuess = guess.color(dayWord);

  // format response
  res.append('uuid', user.id);
  res.send(coloredGuess);
  return;
};

const setPreference = async (req, res) => {
  const user = await userService.getUser(req.headers.uuid);
  if (user.error) {
    return res.send(user);
  }

  res.send(await userService.updateUser(user.id, req.body));
};

const getState = async (req, res) => {
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

module.exports = {
  guess,
  setPreference,
  getState,
};
