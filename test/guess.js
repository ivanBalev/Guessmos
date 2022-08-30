require('dotenv').config({ path: './.env.test' });
const { ObjectId } = require('mongoose').Types;
const { connect, disconnect } = require('../database');
const { expect } = require('chai');
const Guess = require('./../models/guess');
const colors = {
  green: 'green',
  yellow: 'yellow',
  gray: 'gray',
};

describe('colorContent works', function () {
  it('colors words correctly', function () {
    const dayWord = 'sheep';

    // Green is colored first. If match -> letter is out of the game
    const twoGreen = Guess.colorContent('eeeee', dayWord);
    // Letter exists, not in the same place -> out of the game. Last 'e' not colored.
    const twoYellow = Guess.colorContent('eejje', dayWord);
    // All letters exist, not in the same place
    const allYellow = Guess.colorContent('peshe', dayWord);
    // No matching letters
    const allGray = Guess.colorContent('kravi', dayWord);
    // Full match
    const allGreen = Guess.colorContent(dayWord, dayWord);

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

  it('throws errors correctly', function () {
    expect(() => Guess.colorContent(1, 2)).to.throw(
      'please enter arguments of appropriate type'
    );
    expect(() => Guess.colorContent(null, undefined)).to.throw(
      'please enter arguments of appropriate type'
    );
    expect(() => Guess.colorContent('why', 'whod')).to.throw(
      'unsupported data length'
    );
    expect(() =>
      Guess.colorContent('omeletteDuFromage', 'tooLongOfAWord')
    ).to.throw('unsupported data length');
    expect(() => Guess.colorContent('validWord', 'validWord2')).to.throw(
      'unsupported data length'
    );
  });
});

describe('validateForUser works', function () {
  let user = {
    guessLength: 5,
    guessLanguage: 'en',
    attemptsCount: 4,
  };
  let pastUserGuesses = ['pesho', 'misho', 'gosho', 'vasho', 'nasho'];
  let dayWord = 'pesho';
  let guess = {
    length: 6,
    language: 'bg',
  };

  it('throws errors correctly', function () {
    // Guess length doesn't match user's preferred length
    expect(() =>
      Guess.validateForUser(user, pastUserGuesses, dayWord, guess)
    ).to.throw('please insert guess with correct length');

    // Correct guess length
    guess.length = 5;
    // Guess language doesn't match user's preferred language
    expect(() =>
      Guess.validateForUser(user, pastUserGuesses, dayWord, guess)
    ).to.throw('please insert guess in correct language');

    // Correct guess language
    guess.language = 'en';
    // dayWord already guessed successfully
    expect(() =>
      Guess.validateForUser(user, pastUserGuesses, dayWord, guess)
    ).to.throw('you have already guessed the word successfully');

    // Remove correct word from guesses list
    pastUserGuesses.shift();
    // Guess content no longer matches dayWord
    guess.content = 'misho';
    // Guess already exists in guesses list
    expect(() =>
      Guess.validateForUser(user, pastUserGuesses, dayWord, guess)
    ).to.throw('word already entered. please try another');

    // Guess content no longer exists in guesses list
    guess.content = 'akash';
    // Out of attempts for word length & language
    expect(() =>
      Guess.validateForUser(user, pastUserGuesses, dayWord, guess)
    ).to.throw('no more attempts for this language and length');
  });

  it('works fine with valid data', function () {
    // Free up guesses space
    pastUserGuesses.shift();
    // No validation errors
    expect(
      Guess.validateForUser(user, pastUserGuesses, dayWord, guess)
    ).to.equal(undefined);
  });
});

describe('getByUser works', function () {
  this.beforeEach(async () => await connect());
  this.afterEach(async () => await disconnect());

  const user = {
    _id: ObjectId(),
    guessLength: 7,
    guessLanguage: 'en',
  };

  const guesses = [
    {
      // valid
      content: 'nesting',
      language: 'en',
      length: 7,
      userId: user._id,
      wordId: ObjectId(),
    },
    {
      // invalid lang
      content: 'testing',
      language: 'bg',
      length: 7,
      userId: user._id,
      wordId: ObjectId(),
    },
    {
      // invalid length
      content: 'testee',
      language: 'en',
      length: 6,
      userId: user._id,
      wordId: ObjectId(),
    },
    {
      // invalid userId
      content: 'testing',
      language: 'en',
      length: 7,
      userId: ObjectId(),
      wordId: ObjectId(),
    },
    {
      // invalid date
      content: 'prev123',
      language: 'en',
      length: 7,
      userId: user._id,
      wordId: ObjectId(),
      createdAt: getPreviousDay(),
    },
  ];

  it('works correctly', async function () {
    await Guess.insertMany(guesses);
    const dbGuesses = await Guess.getByUser(user);
    // Single matching guess
    expect(dbGuesses.length).to.equal(1);
    // Confirm it's the same as in our objects list
    expect(dbGuesses[0].language).to.equal(user.guessLanguage);
    expect(dbGuesses[0].length).to.equal(user.guessLength);
    expect(dbGuesses[0].content).to.equal(guesses[0].content);
  });
});

// helpers
function expectAllColorsToBe(wordArray, color) {
  expect(wordArray).to.satisfy(function (letters) {
    return letters.every(function (letter) {
      return letter.color === color;
    });
  });
}

function getPreviousDay(date = new Date()) {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);

  return previous;
}
