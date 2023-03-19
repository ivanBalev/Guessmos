require('dotenv').config({ path: './.env.test' });
import { expect } from 'chai';
import { Types } from 'mongoose';
import { connect, dropDatabase } from '../database';
import GuessService from '../services/GuessService';
import getPreviousDay from './helpers/helpers';
import User, { UserDocument } from '../services/UserService';
import WordService from '../services/WordService';
import AppError from '../utils/appError';


const colors = {
  green: 'green',
  yellow: 'yellow',
  gray: 'gray',
};

let user: UserDocument;

type ColoredLetter = { color: string, letter: string };

describe('checkWord works', function () {
  this.beforeEach(async () => {
    await connect();
    user = await new User().save();
  });

  this.afterEach(async () => {
    await dropDatabase();
  });


  it('colors words correctly', async function () {
    const dayWord = 'sheep';

    // Green is colored first. If match -> letter is out of the game
    const word1 = await WordService.create({ language: 'en', content: 'eeeee' });
    const twoGreen = await GuessService.checkWord(user.id!, word1, dayWord);

    // Letter exists, not in the same place -> out of the game. Last 'e' not colored.
    const word2 = await WordService.create({ language: 'en', content: 'eejje' });
    const twoYellow = await GuessService.checkWord(user.id!, word2, dayWord);

    // All letters exist, not in the same place
    const word3 = await WordService.create({ language: 'en', content: 'peshe' });
    const allYellow = await GuessService.checkWord(user.id!, word3, dayWord);

    // No matching letters
    const word4 = await WordService.create({ language: 'en', content: 'kravi' });
    const allGray = await GuessService.checkWord(user.id!, word4, dayWord);

    // Full match
    const word5 = await WordService.create({ language: 'en', content: dayWord });
    const allGreen = await GuessService.checkWord(user.id!, word5, dayWord);

    // [2],[3] are correct letters in correct place
    expectAllColorsToBe([...twoGreen].slice(2, 2), colors.green);

    // [0],[1] are incorrect letters, [4] is correct but both letters 'e' are already green
    expectAllColorsToBe([twoGreen[0], twoGreen[1], twoGreen[4]], colors.gray);

    // [0],[1] are correct letters in incorrect place
    expectAllColorsToBe([...twoYellow].slice(0, 2), colors.yellow);

    // [2],[3] are incorrect letters, [4] is correct but in both letters 'e' are already green
    expectAllColorsToBe([...twoYellow].slice(2), colors.gray);

    expectAllColorsToBe([...allYellow], colors.yellow);
    expectAllColorsToBe([...allGray], colors.gray);
    expectAllColorsToBe([...allGreen], colors.green);
  });

  it('throws errors correctly', async function () {

    const errorMsg = 'Invalid input - unsupported data length';

    const word1 = await WordService.create({ language: 'en', content: 'why' });
    const word2 = await WordService.create({ language: 'en', content: 'omeletteDuFromage' });
    const word3 = await WordService.create({ language: 'en', content: 'validWord' });

    // Assert correct error is thrown for all cases
    try {

      // Check word 1
      await GuessService.checkWord(user.id!, word1, "whod")
    }
    catch (err) {
      let error = err as AppError;
      expect(error).to.exist;
      expect(error.message).to.equal(errorMsg);
    }

    try {

      // Check word 2
      await GuessService.checkWord(user.id!, word2, "tooLongOfAWord")
    }
    catch (err) {
      let error = err as AppError;
      expect(error).to.exist;
      expect(error.message).to.equal(errorMsg);
    }

    try {

      // Check word 3
      await GuessService.checkWord(user.id!, word3, "validWord2")
    }
    catch (err) {
      let error = err as AppError;
      expect(error).to.exist;
      expect(error.message).to.equal(errorMsg);
    }
  });
});

describe('validateForUser works', function () {

  // Arrange
  let user = {
    wordLength: 5,
    wordLanguage: 'en',
    attemptsCount: 4,
  };

  let pastUserGuesses = ['pesho', 'misho', 'gosho', 'vasho', 'nasho'];
  let dayWord = 'pesho';
  let word = {
    length: 6,
    language: 'bg',
    content: "asdfgh"
  };

  it('throws errors correctly', function () {

    // Guess length doesn't match user's preferred length
    // Function doesn't need access to db
    expect(() =>
      GuessService.validateForUser(user, pastUserGuesses, dayWord, word)
    ).to.throw(
      `Invalid input - please insert guess with length ${user.wordLength}`
    );

    // Correct guess length
    word.length = 5;

    // Guess language doesn't match user's preferred language
    expect(() =>
      GuessService.validateForUser(user, pastUserGuesses, dayWord, word)
    ).to.throw(
      `Invalid input - please insert guess in language ${user.wordLanguage}`
    );

    // Correct guess language
    word.language = 'en';

    // dayWord already guessed successfully
    expect(() =>
      GuessService.validateForUser(user, pastUserGuesses, dayWord, word)
    ).to.throw(
      'Invalid input - you have already guessed the word successfully'
    );

    // Remove correct word from guesses list
    pastUserGuesses.shift();

    // Guess content no longer matches dayWord
    word.content = 'misho';

    // Guess already exists in guesses list
    expect(() =>
      GuessService.validateForUser(user, pastUserGuesses, dayWord, word)
    ).to.throw('Invalid input - word already entered. please try another');

    // Guess content no longer exists in guesses list
    word.content = 'akash';

    // Out of attempts for word length & language
    expect(() =>
      GuessService.validateForUser(user, pastUserGuesses, dayWord, word)
    ).to.throw('Invalid input - no more attempts for this language and length');
  });

  it('works fine with valid data', function () {

    // Free up guesses space
    pastUserGuesses.shift();

    // No validation errors
    expect(
      GuessService.validateForUser(user, pastUserGuesses, dayWord, word)
    ).to.equal(undefined);
  });
});

describe('getByUser works', function () {
  this.beforeEach(async () => await connect());
  this.afterEach(async () => await dropDatabase());

  it('works correctly', async function () {
    const user1 = await new User({
      wordLength: 7,
      wordLanguage: 'en',
    }).save();

    // Arrange
    const guesses = [
      {
        // match
        content: 'nesting',
        language: 'en',
        length: 7,
        userId: user1.id,
        wordId: new Types.ObjectId(),
      },
      {
        // non-matching lang
        content: 'testing',
        language: 'bg',
        length: 7,
        userId: user1.id,
        wordId: new Types.ObjectId(),
      },
      {
        // non-matching length
        content: 'testee',
        language: 'en',
        length: 6,
        userId: user1.id,
        wordId: new Types.ObjectId(),
      },
      {
        // non-matching userId
        content: 'testing',
        language: 'en',
        length: 7,
        userId: new Types.ObjectId(),
        wordId: new Types.ObjectId(),
      },
      {
        // past date
        content: 'prev123',
        language: 'en',
        length: 7,
        userId: user1.id,
        wordId: new Types.ObjectId(),
        createdAt: getPreviousDay(),
      },
    ];

    await GuessService.insertMany(guesses);
    const dbGuesses = await GuessService.getByUser(user1);

    // Single matching guess
    expect(dbGuesses.length).to.equal(1);

    // Confirm it's the same as in our objects list
    expect(dbGuesses[0].language).to.equal(user1.wordLanguage);
    expect(dbGuesses[0].length).to.equal(user1.wordLength);
    expect(dbGuesses[0].content).to.equal(guesses[0].content);
  });
});

// helpers
function expectAllColorsToBe(wordArray: ColoredLetter[], color: string) {
  expect(wordArray).to.satisfy(function (letters: ColoredLetter[]) {
    return letters.every(function (letter: ColoredLetter) {
      return letter.color === color;
    });
  });
}
