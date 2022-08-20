const userService = require('../user/dbService');
const wordService = require('../word/dbService');
const guessService = require('../guess/dbService');
const { setGuessColors, getDayWord } = require('./utility/common');
const validateGuess = require('./utility/validation');

// TODO: rename fn to just guess ?
const guessDayWord = async (req, res) => {
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
  // TODO: keep word content in guess to avoid too many queries
  const userGuesses = (await wordService.findByIds(userGuessesWordIds)).map(
    (w) => w.content
  );
  let dayWord = await getDayWord(user);

  console.log('DAYWORD IS: ' + dayWord);
  const validateGuessResult = validateGuess(userGuesses, user, dayWord, word);
  if (validateGuessResult?.error) {
    return res.send(validateGuessResult);
  }

  await guessService.create(user.id, word);

  // TODO: No need for guess and dayWord entities - ref ids array
  const coloredGuess = setGuessColors(dayWord, word.content);

  // format response
  res.append('uuid', user.id);
  res.send(coloredGuess);
  return;
};

module.exports = guessDayWord;
