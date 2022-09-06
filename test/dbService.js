require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const chai = require('chai');
const expect = chai.expect;
const { connect, disconnect } = require('../database');
const Word = require('../models/word');
const User = require('../models/user');
const Guess = require('../models/guess');
const dbService = require('../services/dbService');
const getDayWord = require('../utils/getDayWord');
const mongoose = require('mongoose');
const getPreviousDay = require('./helpers/helpers');
const originalCacheTTL = process.env.CACHE_TTL;

let user;

const words = [
  {
    content: 'test1',
    language: 'en',
    length: 5,
  },
  {
    content: 'guess',
    language: 'en',
    length: 5,
  },
  {
    content: 'glass',
    language: 'en',
    length: 5,
  },
];

describe('guess function', function () {
  this.beforeAll(() => {
    // Need control over dayWord TTL
    process.env.CACHE_TTL = 60 * 60 * 24;
  });

  this.afterAll(() => {
    // Cache time to live set to 1 second by default in cfg
    process.env.CACHE_TTL = originalCacheTTL;
  });

  this.beforeEach(async () => {
    await connect();
    user = await new User().save();
  });

  this.afterEach(async () => {
    await disconnect();
  });

  it('creates guesses correctly', async function () {
    // Arrange
    await Word.insertMany(words);

    // Act
    const dayWord = await getDayWord(user);
    // Get words from list that are not the dayWord
    const clientGuesses = words
      .filter((w) => w.content !== dayWord)
      .map((w) => w.content);

    // Create guesses for user
    for (let i = 0; i < clientGuesses.length; i++) {
      await dbService.guess(clientGuesses[i], user);
    }

    // Get user guesses from db
    const userGuesses = (await Guess.find({ userId: user._id })).map(
      (g) => g.content
    );

    const result = true;
    // Confirm guesses don't include dayWord
    clientGuesses.forEach((w) => {
      if (!userGuesses.includes(w)) {
        result = false;
      }
    });

    expect(result).to.be.true;
  });

  it('throws errors correctly', async function () {
    let error;
    try {
      await dbService.guess('vaskoZhabata', user);
    } catch (err) {
      error = err;
    }

    // Expect function to throw error with non-existent word
    expect(error).to.exist;
    expect(error.message).to.equal(
      'Invalid input - word does not exist in dictionary'
    );
  });
});

describe('getUserState function', function () {
  this.beforeEach(async () => {
    await connect();
    user = await new User().save();
  });
  this.afterEach(async () => await disconnect());

  it('returns all guesses for current day, length and language', async function () {
    // Arrange
    // Create guesses for user, bypassing service check for non-existent word
    const guesses = [
      ...words,
      {
        content: 'past1',
        length: 5,
        language: 'en',
        createdAt: getPreviousDay(),
      },
      {
        content: 'longer',
        length: 6,
        language: 'en',
      },
    ].map((w) => {
      return { ...w, userId: user._id, wordId: mongoose.Types.ObjectId() };
    });
    await Guess.insertMany(guesses);

    // Create single word in db
    await new Word({ content: 'slugs', length: 5, language: 'en' }).save();

    // Get user guesses for current day
    const userState = await dbService.getUserState(user);

    // Assert we don't get entries that are old or not matching user preference
    expect(userState.length).to.equal(words.length);
    const userStateContent = userState.map((x) =>
      x.map((y) => y.value).join('')
    );

    let result = true;

    // Assert all documents received from db equal those we entered
    words.forEach((w) => {
      if (!userStateContent.includes(w.content)) {
        result = false;
      }
    });
    expect(result).to.be.true;
  });
});

describe('updateUser function', function () {
  this.beforeEach(async () => {
    await connect();
    user = await new User().save();
  });
  this.afterEach(async () => await disconnect());

  it('works correctly', async function () {
    const word = {
      content: 'осембукв',
      length: 8,
      language: 'bg',
    };
    const preference = {
      wordLength: word.length,
      attemptsCount: 40,
      wordLanguage: word.language,
    };

    // Create single word in db
    await new Word(word).save();

    // Update user preference to match that word
    await dbService.updateUser(user, preference);
    let error = null;
    try {
      // Submit guess with content equal to only word in db
      await dbService.guess(word.content, user);
    } catch (err) {
      error = err;
    }
    // Assert no errors are thrown with valid guess
    expect(error).to.be.null;
  });
});
