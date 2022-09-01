require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const chai = require('chai');
const expect = chai.expect;
const { connect, disconnect } = require('../database');
const mongoose = require('mongoose');
const getDayWord = require('../utils/getDayWord');
const Word = require('../models/word');

describe('getDayWord', function () {
  this.beforeEach(async () => {
    await connect();
  });

  this.afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await disconnect();
    }
  });

  it('works fine', async function () {
    // Arrange
    const user5 = {
      wordLength: 5,
      wordLanguage: 'en',
    };

    const user6 = {
      wordLength: 6,
      wordLanguage: 'en',
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

    await Word.insertMany(words);

    // Act
    let dayWord5 = await getDayWord(user5);
    let dayWord6 = await getDayWord(user6);
    // Returns user-specific word
    expect(dayWord5).to.equal(words[0].content);
    expect(dayWord6).to.equal(words[1].content);

    // Returns word from cache if already requested
    await disconnect();
    dayWord5 = await getDayWord(user5);
    dayWord6 = await getDayWord(user6);
    expect(dayWord5).to.equal(words[0].content);
    expect(dayWord6).to.equal(words[1].content);

    // Wait for cache to clear
    await new Promise((resolve) =>
      setTimeout(resolve, `${process.env.CACHE_TTL}` * 1000)
    );

    let error;
    try {
      dayWord5 = await getDayWord(user5);
    } catch (err) {
      error = err;
    }

    // Cache has cleared (24h have passed in prod)
    expect(error).to.exist;
  });
});
