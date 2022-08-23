const wordService = require('../word/dbService');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });

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
    const queryObj = { language: user.guessLanguage, length: user.guessLength };

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

module.exports = getDayWord;
