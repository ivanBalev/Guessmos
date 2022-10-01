// require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
// import chai from 'chai';
// const expect = chai.expect;
// import { connect, disconnect } from '../database';
// import authMiddleware from '../middlewares/auth';
// import mongoose from 'mongoose';
// import { promisify } from 'util';
// import {Request, Response} from 'express';
// import AppError from '../utils/appError';
// var MockExpressRequest = require('mock-express-request');
// var MockExpressResponse = require('mock-express-response');

// // import AppError from '../utils/appError';

// describe('auth middleware', function () {
//   // Create mock request & response objects
//   let mockRequest: Request = new MockExpressRequest();
//   let mockResponse: Response = new MockExpressResponse();

//   this.beforeEach(async () => {
//     // Connect to db and return response & request to default state
//     await connect();
//     mockRequest = new MockExpressRequest();
//     mockResponse = new MockExpressResponse();
//   });

//   this.afterEach(async () => {
//     await disconnect();
//   });

//   it('creates new user with no given uuid in request', async function () {
//     await promisify(authMiddleware)(mockRequest, mockResponse);

//     // Valid user
//     expect(mockResponse.locals.user).to.exist;
//     expect(mongoose.isValidObjectId(mockResponse.locals.user._id)).to.be.true;

//     // Valid default user preference
//     expect(mockResponse.locals.user.wordLength).to.equal(5);
//     expect(mockResponse.locals.user.wordLanguage).to.equal('en');
//     expect(mockResponse.locals.user.attemptsCount).to.equal(6);
    
//     // Valid response user attached
//     expect(mockResponse.get('uuid')).to.exist;
//     expect(mongoose.isValidObjectId(mockResponse.get('uuid'))).to.be.true;
//   });

//   it('throws errors correctly', async function () {
//     // Create invalid ObjectId
//     mockRequest.headers.uuid = 'invalidObjectId';
//     let error: AppError;

//     try {
//       await promisify(authMiddleware)(mockRequest, mockResponse);
//     } catch (err) {
//       error = err as AppError;
//       // Expect auth middleware to throw error with invalid id
//     expect(error.message).to.equal('Invalid input - user id');
//     expect(error.status).to.equal('fail');
//     }
    
//     // Create valid but non-existent ObjectId
//     mockRequest.headers.uuid = (new mongoose.Types.ObjectId()).toString();
//     try {
//       await promisify(authMiddleware)(mockRequest, mockResponse);
//     } catch (err) {
//       error = err as AppError;
//       // Expect auth middleware to throw error with non-existent user
//     expect(error.message).to.equal('Invalid input - user does not exist');
//     expect(error.status).to.equal('fail');
//     }
//   });
// });
