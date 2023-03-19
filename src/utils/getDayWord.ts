import WordService from '../services/WordService';
import NodeCache from 'node-cache';
import AppError from '../utils/appError';
import User from '../models/User';
import Word from '../models/Word';

export const cache = new NodeCache({ stdTTL: +`${process.env.CACHE_TTL}` });
export default async function getDayWord(user: User) {

  // Define word of the day
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
    const query = { language: user.wordLanguage, length: user.wordLength };

    // Get dayWord from db
    const dbWord = (await WordService.findRandom(query)) as Word;

    if (!dbWord) {
      throw new AppError(
        'Cannot find word in database which satisfies given conditions.',
        400
      );
    }

    // Update dayWordDates field
    await WordService.findByIdAndUpdate(dbWord.id!, { dayWordDates: [...dbWord.dayWordDates!, Date.now()] }, { runValidators: true })

    // Add dayWord to cache
    dayWord = dbWord.content;
    cache.set(dbWord.content, dbWord.language);
  }

  // For testing
  console.log('DAYWORD IS: ', dayWord);
  return dayWord;
};
