const wordService = require('../../word/dbService');
const NodeCache = require('node-cache');

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

// TODO: move this to Word entity
const getDayWord = async (user) => {
  let dayWord = '';

  // Check for dayWord in cache
  for (const key in cache.mget(cache.keys())) {
    if (
      key.length === user.wordLength &&
      cache.get(key) === user.wordLanguage
    ) {
      dayWord = key;
    }
  }

  // Add word to cache if it's not there
  if (!dayWord) {
    const queryObj = { language: user.wordLanguage, length: user.wordLength };

    // Randomize words in db
    const wordsCount = await wordService.count(queryObj);
    const skipCount = Math.floor(Math.random() * wordsCount);

    // Get dayWord from db and update dayWordDates record
    const dbWord = await wordService.findOne(queryObj, skipCount);
    dbWord.dayWordDates.push(Date.now());
    await dbWord.save();

    // Add dayWord to cache
    dayWord = dbWord.content;
    cache.set(dbWord.content, dbWord.language);
  }

  return dayWord;
};

module.exports = {
  setGuessColors,
  getDayWord,
};
