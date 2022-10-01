// require('dotenv').config({ path: './.env.test' });
// import { Types } from 'mongoose';
// import { connect, disconnect } from '../database';
// import { expect } from 'chai';
// import Guess from '../services/mongoose/GuessService';
// import getPreviousDay from './helpers/helpers';
// import { UserDocument } from '../services/mongoose/UserService';
// import { WordDocument } from '../services/mongoose/WordService';
// import { ColoredLetter } from '../services/mongoose/GuessService';

// const colors = {
//   green: 'green',
//   yellow: 'yellow',
//   gray: 'gray',
// };

// describe('colorContent works', function () {
//   it('colors words correctly', function () {
//     const dayWord = 'sheep';

//     // Green is colored first. If match -> letter is out of the game
//     const twoGreen = Guess.colorContent('eeeee', dayWord);
//     // Letter exists, not in the same place -> out of the game. Last 'e' not colored.
//     const twoYellow = Guess.colorContent('eejje', dayWord);
//     // All letters exist, not in the same place
//     const allYellow = Guess.colorContent('peshe', dayWord);
//     // No matching letters
//     const allGray = Guess.colorContent('kravi', dayWord);
//     // Full match
//     const allGreen = Guess.colorContent(dayWord, dayWord);

//     // [2],[3] are correct letters in correct place
//     expectAllColorsToBe([...twoGreen].slice(2, 2), colors.green);
//     // [0],[1] are incorrect letters, [4] is correct but both letters 'e' are already green
//     expectAllColorsToBe([twoGreen[0], twoGreen[1], twoGreen[4]], colors.gray);
//     // [0],[1] are correct letters in incorrect place
//     expectAllColorsToBe([...twoYellow].slice(0, 2), colors.yellow);
//     // [2],[3] are incorrect letters, [4] is correct but in both letters 'e' are already green
//     expectAllColorsToBe([...twoYellow].slice(2), colors.gray);

//     expectAllColorsToBe([...allYellow], colors.yellow);
//     expectAllColorsToBe([...allGray], colors.gray);
//     expectAllColorsToBe([...allGreen], colors.green);
//   });

//   it('throws errors correctly', function () {
//     // Invalid input length
//     expect(() => Guess.colorContent('why', 'whod')).to.throw(
//       'unsupported data length'
//     );
//     expect(() =>
//       Guess.colorContent('omeletteDuFromage', 'tooLongOfAWord')
//     ).to.throw('unsupported data length');
//     expect(() => Guess.colorContent('validWord', 'validWord2')).to.throw(
//       'unsupported data length'
//     );
//   });
// });

// describe('validateForUser works', function () {
//   // Arrange
//   let user = {
//     wordLength: 5,
//     wordLanguage: 'en',
//     attemptsCount: 4,
//   } as UserDocument;
//   let pastUserGuesses = ['pesho', 'misho', 'gosho', 'vasho', 'nasho'];
//   let dayWord = 'pesho';
//   let word = {
//     length: 6,
//     language: 'bg',
//   } as WordDocument;

//   it('throws errors correctly', function () {
//     // Guess length doesn't match user's preferred length
//     // Function doesn't need access to db
//     expect(() =>
//       Guess.validateForUser(user, pastUserGuesses, dayWord, word)
//     ).to.throw(
//       `Invalid input - please insert guess with length ${user.wordLength}`
//     );

//     // Correct guess length
//     word.length = 5;
//     // Guess language doesn't match user's preferred language
//     expect(() =>
//       Guess.validateForUser(user, pastUserGuesses, dayWord, word)
//     ).to.throw(
//       `Invalid input - please insert guess in language ${user.wordLanguage}`
//     );

//     // Correct guess language
//     word.language = 'en';
//     // dayWord already guessed successfully
//     expect(() =>
//       Guess.validateForUser(user, pastUserGuesses, dayWord, word)
//     ).to.throw(
//       'Invalid input - you have already guessed the word successfully'
//     );

//     // Remove correct word from guesses list
//     pastUserGuesses.shift();
//     // Guess content no longer matches dayWord
//     word.content = 'misho';
//     // Guess already exists in guesses list
//     expect(() =>
//       Guess.validateForUser(user, pastUserGuesses, dayWord, word)
//     ).to.throw('Invalid input - word already entered. please try another');

//     // Guess content no longer exists in guesses list
//     word.content = 'akash';
//     // Out of attempts for word length & language
//     expect(() =>
//       Guess.validateForUser(user, pastUserGuesses, dayWord, word)
//     ).to.throw('Invalid input - no more attempts for this language and length');
//   });

//   it('works fine with valid data', function () {
//     // Free up guesses space
//     pastUserGuesses.shift();
//     // No validation errors
//     expect(
//       Guess.validateForUser(user, pastUserGuesses, dayWord, word)
//     ).to.equal(undefined);
//   });
// });

// describe('getByUser works', function () {
//   this.beforeEach(async () => await connect());
//   this.afterEach(async () => await disconnect());

//   // Arrange
//   const user = {
//     _id: new Types.ObjectId(),
//     wordLength: 7,
//     wordLanguage: 'en',
//   } as UserDocument;

//   const guesses = [
//     {
//       // match
//       content: 'nesting',
//       language: 'en',
//       length: 7,
//       userId: user._id,
//       wordId: new Types.ObjectId(),
//     },
//     {
//       // non-matching lang
//       content: 'testing',
//       language: 'bg',
//       length: 7,
//       userId: user._id,
//       wordId: new Types.ObjectId(),
//     },
//     {
//       // non-matching length
//       content: 'testee',
//       language: 'en',
//       length: 6,
//       userId: user._id,
//       wordId: new Types.ObjectId(),
//     },
//     {
//       // non-matching userId
//       content: 'testing',
//       language: 'en',
//       length: 7,
//       userId: new Types.ObjectId(),
//       wordId: new Types.ObjectId(),
//     },
//     {
//       // past date
//       content: 'prev123',
//       language: 'en',
//       length: 7,
//       userId: user._id,
//       wordId: new Types.ObjectId(),
//       createdAt: getPreviousDay(),
//     },
//   ];

//   it('works correctly', async function () {
//     await Guess.insertMany(guesses);
//     const dbGuesses = await Guess.getByUser(user);
//     // Single matching guess
//     expect(dbGuesses.length).to.equal(1);
//     // Confirm it's the same as in our objects list
//     expect(dbGuesses[0].language).to.equal(user.wordLanguage);
//     expect(dbGuesses[0].length).to.equal(user.wordLength);
//     expect(dbGuesses[0].content).to.equal(guesses[0].content);
//   });
// });

// // helpers
// function expectAllColorsToBe(wordArray: ColoredLetter[], color: string) {
//   expect(wordArray).to.satisfy(function (letters: ColoredLetter[]) {
//     return letters.every(function (letter: ColoredLetter) {
//       return letter.color === color;
//     });
//   });
// }
