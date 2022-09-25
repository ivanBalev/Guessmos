import Word, {WordDocument} from '../models/word';
import NodeCache from 'node-cache';
import * as mongooseRepository from './../services/mongooseRepository';
import { UserDocument } from '../models/user';
import AppError  from '../utils/appError';
const cache = new NodeCache({ stdTTL: +`${process.env.CACHE_TTL}` });

export default async function getDayWord(user: UserDocument) {
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
    const dbWord = (await mongooseRepository.findRandom(Word, query)) as WordDocument;

    if(!dbWord) {
      throw new AppError(
        'Cannot find word in database which satisfies given conditions.',
        400
      );
    }
    
    // Update dayWordDates field
    await mongooseRepository.update(
      dbWord,
      {dayWordDates: [...dbWord.dayWordDates, Date.now()]}
    );

    // Add dayWord to cache
    dayWord = dbWord.content;
    cache.set(dbWord.content, dbWord.language);
  }

  // For testing
  console.log('DAYWORD IS: ', dayWord);
  return dayWord;
};
