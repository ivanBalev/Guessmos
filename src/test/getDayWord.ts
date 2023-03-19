require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
import chai from 'chai';
const expect = chai.expect;
import { connect, dropDatabase } from '../database';
import mongoose from 'mongoose';
import getDayWord, { cache } from '../utils/getDayWord';
import WordService from '../services/WordService';

describe('getDayWord', function () {
  this.beforeEach(async () => {
    await connect();
  });

  this.afterEach(async () => {
    // Check if we haven't already disconnected (which we do to check cache works fine)
    if (mongoose.connection.readyState === 1) {
      await dropDatabase();
    }
  });

  it('works fine', async function () {

    // Arrange
    const user5 = {
      wordLength: 5,
      wordLanguage: 'en',
      attemptsCount: 20
    };

    const user6 = {
      wordLength: 6,
      wordLanguage: 'en',
      attemptsCount: 20
    };

    const words = [
      {
        content: 'testW',
        length: user5.wordLength,
        language: user5.wordLanguage,
      },
      {
        content: 'testWo',
        length: user6.wordLength,
        language: user6.wordLanguage,
      },
    ];

    // Add words to db
    await WordService.insertMany(words);

    // Get dayWords for both users(should be different words as preference differs)
    let dayWord5 = await getDayWord(user5);
    let dayWord6 = await getDayWord(user6);

    // Assert function returns user-specific word
    expect(dayWord5).to.equal(words[0].content);
    expect(dayWord6).to.equal(words[1].content);

    // Assert functiton returns word from cache if already requested
    await dropDatabase();
    dayWord5 = await getDayWord(user5);
    dayWord6 = await getDayWord(user6);
    expect(dayWord5).to.equal(words[0].content);
    expect(dayWord6).to.equal(words[1].content);

    // Clear cache
    cache.flushAll();

    let error;
    try {
      // At this point, we're disconnected from db
      dayWord5 = await getDayWord(user5);
      console.log(dayWord5);
    } catch (err) {
      error = err;
    }

    // No dayWords in cache and connection to db closed
    expect(error).to.exist;
  });
});
