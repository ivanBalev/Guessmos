const Word = require('../models/word');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });
const mongooseRepository = require('./../services/mongooseRepository');

module.exports = async function (user) {
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
};
