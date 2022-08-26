const Word = require('../models/word');
const Guess = require('../models/guess');
const AppError = require('./../utils/appError');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });

const colors = {
  green: 'green',
  yellow: 'yellow',
  gray: 'gray',
};

async function guess(guess, user) {
  // Check if word exists in db
  const word = await Word.findOne({ content: guess });
  if (!word) {
    throw new AppError('word does not exist in dictionary');
  }

  // Get all user guesses
  const userGuesses = (await getUserGuesses(user)).map((g) => g.content);
  // Get dayWord
  let dayWord = await getDayWord(user);
  // Validate guess
  validateGuess(user, userGuesses, dayWord, word);

  // Create new guess
  // TODO - BLOW THIS UP AND SEE WHAT HAPPENS IN ERROR HANDLING - enter invalid data
  await new Guess({
    userId: user._id,
    wordId: word._id,
    length: word.length,
    language: word.language,
    content: word.content,
  }).save();

  return colorGuess(guess, dayWord);
}

async function getUserState(user) {
  const pastUserGuesses = (await getUserGuesses(user)).map((g) => g.content);
  const dayWord = await getDayWord(user);
  return pastUserGuesses.map((g) => colorGuess(g, dayWord));
}

async function updateUser(user, preference) {
  for (const [key, value] of Object.entries(preference)) {
    user[key] = value;
  }
  await user.save();
  return;
}

module.exports = {
  guess,
  getUserState,
  updateUser,
};

// Helper functions
function colorGuess(guess, dayWord) {
  let dayWordArr = [...dayWord];
  let result = [...guess].map((c) => {
    return { value: c, color: colors.gray };
  });
  // green
  result.forEach((c, idx) => {
    if (dayWord[idx] == c.value) {
      result[idx].color = colors.green;
      dayWordArr[idx] = null;
    }
  });
  // yellow
  result.forEach((c, idx) => {
    if (dayWordArr.includes(c.value) && c.color != colors.green) {
      result[idx].color = colors.yellow;
      dayWordArr[dayWordArr.indexOf(c.value)] = null;
    }
  });
  return result;
}

function validateGuess(user, pastUserGuesses, dayWord, guess) {
  // user preference does not match entered data
  if (user.guessLength !== guess.length) {
    throw new AppError(`please insert guess with correct length`);
  }
  // user preference does not match entered data
  if (user.guessLanguage !== guess.language) {
    throw new AppError(`please insert guess in correct language`);
  }
  // check if user wasn't already correct
  if (pastUserGuesses.includes(dayWord)) {
    throw new AppError('you have already guessed the word successfully');
  }
  // check if user hasn't already entered the same word
  if (pastUserGuesses.includes(guess.content)) {
    throw new AppError('word already entered. please try another');
  }
  // check attempts count
  if (pastUserGuesses.length == user.attemptsCount) {
    throw new AppError('no more attempts for this language and length');
  }
}

async function getUserGuesses(user) {
  const { todayStr, tomorrowStr } = getDateStrings();
  const guesses = await Guess.find({
    userId: user._id,
    createdAt: {
      $gte: todayStr,
      $lte: tomorrowStr,
    },
    length: user.guessLength,
    language: user.guessLanguage,
  });
  return guesses;
}

async function getDayWord(user) {
  let dayWord = '';

  // Check for dayWord in cache
  for (const key in cache.mget(cache.keys())) {
    if (
      key.length === user.guessLength &&
      cache.get(key) === user.guessLanguage
    ) {
      dayWord = key;
    }
  }

  // Add word to cache if it's not there
  if (!dayWord) {
    const queryObj = { language: user.guessLanguage, length: user.guessLength };

    // Randomize words in db
    const wordsCount = await await Word.countDocuments(queryObj);
    const skip = Math.floor(Math.random() * wordsCount);

    // Get dayWord from db and update dayWordDates record
    const dbWord = await await Word.find(queryObj).skip(skip).findOne();
    dbWord.dayWordDates.push(Date.now());
    await dbWord.save();

    // Add dayWord to cache
    dayWord = dbWord.content;
    cache.set(dbWord.content, dbWord.language);
  }

  return dayWord;
}

function getDateStrings() {
  let today = new Date();
  let tomorrow = new Date();
  tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));

  const todayStr = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;
  const tomorrowStr = `${tomorrow.getFullYear()}-${
    tomorrow.getMonth() + 1
  }-${tomorrow.getDate()}`;

  return { todayStr, tomorrowStr };
}
