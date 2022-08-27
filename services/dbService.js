const Word = require('../models/word');
const Guess = require('../models/guess');
const mongooseRepository = require('./mongooseRepository');
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
  const word = await mongooseRepository.findOne(Word, { content: guess });
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
  const guessObject = {
    userId: user._id,
    wordId: word._id,
    length: word.length,
    language: word.language,
    content: word.content,
  };
  await mongooseRepository.create(Guess, guessObject);

  return colorGuess(guess, dayWord);
}

async function getUserState(user) {
  const pastUserGuesses = (await getUserGuesses(user)).map((g) => g.content);
  const dayWord = await getDayWord(user);
  return pastUserGuesses.map((g) => colorGuess(g, dayWord));
}

async function updateUser(user, preference) {
  await mongooseRepository.update(user, preference);
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
  const findQuery = {
    userId: user._id,
    createdAt: {
      $gte: todayStr,
      $lte: tomorrowStr,
    },
    length: user.guessLength,
    language: user.guessLanguage,
  };
  return await mongooseRepository.findMany(Guess, findQuery);
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
    const query = { language: user.guessLanguage, length: user.guessLength };

    // Get dayWord from db and update dayWordDates record
    const dbWord = await mongooseRepository.findRandom(Word, query);
    // Get dayWord from db and update dayWordDates record

    await mongooseRepository.addToArrayField(
      dbWord,
      'dayWordDates',
      Date.now()
    );

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
