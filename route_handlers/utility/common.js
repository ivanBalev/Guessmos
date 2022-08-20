const wordService = require('../../word/dbService');
const NodeCache = require('node-cache');

// TODO: make flexible when cache is cleared -
// store Date variable in cache at server start
// and delete cache every 24 hours

// TODO: do we need this file at all? Cant it be instantiated in common.js
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });

const colors = {
  green: 'green',
  yellow: 'yellow',
  gray: 'gray',
};

// TODO: move this to Word entity
const setGuessColors = (dayWord, word) => {
  let dayWordArr = [...dayWord];
  let result = [...word].map((c) => {
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
};

const getDayWord = async (user) => {
  let word = '';

  for (const key in cache.mget(cache.keys())) {
    console.log('DAYWORD: ' + key);

    if (
      key.length === user.wordLength &&
      cache.get(key) === user.wordLanguage
    ) {
      word = key;
    }
  }

  // Add word to cache if it's not there
  if (!word) {
    const queryObj = { language: user.wordLanguage, length: user.wordLength };

    // Randomize words
    const wordsCount = await wordService.count(queryObj);
    const skipCount = Math.floor(Math.random() * wordsCount);

    const dbWord = await wordService.findOne(queryObj, skipCount);
    word = dbWord.content;

    // TODO: update word record to indicate it's been chosen as dayword
    cache.set(dbWord.content, dbWord.language);
  }

  return word;
};

module.exports = {
  setGuessColors,
  getDayWord,
};
