// require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
// import chai from 'chai';
// const expect = chai.expect;
// import { connect, disconnect } from '../database';
// import mongoose from 'mongoose';
// import getDayWord from '../utils/getDayWord';
// import Word from '../services/mongoose/WordService';
// import {UserDocument} from '../services/mongoose/UserService';

// describe('getDayWord', function () {
//   this.beforeEach(async () => {
//     await connect();
//   });

//   this.afterEach(async () => {
//     // Check if we haven't already disconnected (which we do to check cache works fine)
//     if (mongoose.connection.readyState === 1) {
//       await disconnect();
//     }
//   });

//   it('works fine', async function () {
//     // Arrange
//     const user5 = {
//       wordLength: 5,
//       wordLanguage: 'en',
//     } as UserDocument;

//     const user6 = {
//       wordLength: 6,
//       wordLanguage: 'en',
//     } as UserDocument;

//     const words = [
//       {
//         content: 'testW',
//         length: user5.wordLength,
//         language: user5.wordLanguage,
//       },
//       {
//         content: 'testWo',
//         length: user6.wordLength,
//         language: user6.wordLanguage,
//       },
//     ];

//     await Word.insertMany(words);

//     // Act
//     let dayWord5 = await getDayWord(user5);
//     let dayWord6 = await getDayWord(user6);
//     // Assert function returns user-specific word
//     expect(dayWord5).to.equal(words[0].content);
//     expect(dayWord6).to.equal(words[1].content);

//     // Assert functiton returns word from cache if already requested
//     await disconnect();
//     dayWord5 = await getDayWord(user5);
//     dayWord6 = await getDayWord(user6);
//     expect(dayWord5).to.equal(words[0].content);
//     expect(dayWord6).to.equal(words[1].content);


//     const cacheTTL = process.env.CACHE_TTL;
//     // Wait for cache to clear
//     if(cacheTTL) {
//       await new Promise(
//         (resolve) => setTimeout(resolve, +cacheTTL * 1000) // 1 second
//       );
//     }

//     // Assert cache has cleared (24h have passed in prod)
//     let error;
//     try {
//       dayWord5 = await getDayWord(user5);
//     } catch (err) {
//       error = err;
//     }

//     // No dayWords in cache and connection to db closed
//     expect(error).to.exist;
//   });
// });
