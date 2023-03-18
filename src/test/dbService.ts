require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
import chai from 'chai';
const expect = chai.expect;
import { connect, disconnect } from '../database';
import WordService from '../services/WordService';
import UserService from '../services/UserService';
import User, { UserDocument } from '../services/UserService';
import GuessService, { constants as guessConstants } from '../services/GuessService';
import getDayWord from '../utils/getDayWord';
import mongoose from 'mongoose';
import getPreviousDay from './helpers/helpers';
import AppError from '../utils/appError';
import Word from '../models/Word';
const originalCacheTTL = process.env.CACHE_TTL;

let user: UserDocument;

const words = [
  {
    content: 'test1',
    language: 'en',
    length: guessConstants.minLength,
  },
  {
    content: 'guess',
    language: 'en',
    length: guessConstants.minLength,
  },
  {
    content: 'glass',
    language: 'en',
    length: guessConstants.minLength,
  },
];

describe('guess function', function () {
  this.beforeAll(() => {
    // Need control over dayWord TTL
    process.env.CACHE_TTL = `${60 * 60 * 24}`;
  });

  this.afterAll(() => {
    // Cache time to live set to 1 second by default in cfg
    process.env.CACHE_TTL = originalCacheTTL;
  });

  this.beforeEach(async () => {
    // Connect to db & create new user
    await connect();
    user = await new User().save();
  });

  this.afterEach(async () => {
    await disconnect();
  });

  it('creates guesses correctly', async function () {
    // Create words in db
    const dbWords = await WordService.insertMany(words);

    // Get dayWord for user's current preference
    const dayWord = await getDayWord(user);

    // Get words from list that are not the dayWord
    const clientGuesses = dbWords.filter((w) => w.content !== dayWord);

    // Create guesses for user
    for (let i = 0; i < clientGuesses.length; i++) {
      await GuessService.checkWord(user.id!, clientGuesses[i], dayWord);
    }

    // Get user guesses content from db
    const userGuessesContent = (await GuessService.find({ userId: user._id })).map((g) => g.content);

    let result = true;

    // Confirm guesses don't include dayWord
    clientGuesses.forEach((w) => {
      if (!userGuessesContent.includes(w.content)) {
        result = false;
      }
    });

    expect(result).to.be.true;
  });

  it('throws errors correctly', async function () {

    let error: AppError;

    try {
      const dayWord = new Word({
        content: "test",
        language: "en",
        length: guessConstants.minLength - 1
      })
      const invalidWord = new Word({
        content: "vaskoZhabata",
        language: "bg",
        length: guessConstants.maxLength + 1
      })

      // Attempt to check invalid words
      await GuessService.checkWord(user.id!, invalidWord!, dayWord.content);
    } catch (err) {
      error = err as AppError;
      // Expect function to throw error with non-existent word
      expect(error).to.exist;
      expect(error.message).to.equal(
        'Invalid input - unsupported data length'
      );
    }
  });
});

describe('getUserState function', function () {
  this.beforeEach(async () => {
    await connect();
    user = await new User().save();
  });
  this.afterEach(async () => await disconnect());

  it('returns all guesses for current day, length and language', async function () {
    
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
      return { ...w, userId: user._id, wordId: new mongoose.Types.ObjectId() };
    });
    await GuessService.insertMany(guesses);

    // Create single word in db
    await WordService.create(new Word({ content: 'slugs', length: 5, language: 'en' }));

    // Get user guesses for current day
    const userGuesses = await GuessService.getByUser(user);

    // Assert we don't get entries that are old or not matching user preference
    expect(userGuesses.length).to.equal(words.length);

    let result = true;

    // Assert all documents received from db equal those we entered
    words.forEach((w) => {
      if (!userGuesses.map(g => g.content).includes(w.content)) {
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
      id: new mongoose.Types.ObjectId().toString(),
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
    await WordService.create(word);

    // Update user preference to match that word
    await UserService.findByIdAndUpdate(user.id!, preference);

    const result = await GuessService.checkWord(user.id!, word, 'осембукв');
    expect(result.every(x => x.color == 'green')).to.be.true;
  });
});
