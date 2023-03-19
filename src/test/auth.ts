require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
import chai from 'chai';
const expect = chai.expect;
import { connect, dropDatabase } from '../database';
import authMiddleware from '../middlewares/auth';
import mongoose from 'mongoose';
import { promisify } from 'util';
import { Request, Response } from 'express';
import AppError from '../utils/appError';
var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');

describe('auth middleware', function () {
  // Create mock request & response objects
  let mockRequest: Request = new MockExpressRequest();
  let mockResponse: Response = new MockExpressResponse();

  this.beforeEach(async () => {
    // Connect to db and return response & request to default state
    await connect();
    mockRequest = new MockExpressRequest();
    mockResponse = new MockExpressResponse();
  });

  this.afterEach(async () => {
    await dropDatabase();
  });

  it('creates new user with no given uuid in request', async function () {

    // Call auth middleware func
    await promisify(authMiddleware)(mockRequest, mockResponse);

    // Validate user
    expect(mockResponse.locals.user).to.exist;
    expect(mongoose.isValidObjectId(mockResponse.locals.user.id)).to.be.true;

    // Validate default user preference
    expect(mockResponse.locals.user.wordLength).to.equal(5);
    expect(mockResponse.locals.user.wordLanguage).to.equal('en');
    expect(mockResponse.locals.user.attemptsCount).to.equal(6);

    // Validate response user attached
    expect(mockResponse.get('uuid')).to.exist;
    expect(mongoose.isValidObjectId(mockResponse.get('uuid'))).to.be.true;
  });

  it('throws errors correctly', async function () {
    // Create invalid ObjectId
    mockRequest.headers.uuid = 'invalidObjectId';
    let error: AppError;

    try {
      // Call auth middleware func
      await promisify(authMiddleware)(mockRequest, mockResponse);
    } catch (err) {
      error = err as AppError;
      // Expect auth middleware to throw error with invalid id
      expect(error.message).to.contain('malformed user id');
    }

    // Create valid but non-existent ObjectId
    mockRequest.headers.uuid = (new mongoose.Types.ObjectId()).toString();
    try {
      // Call auth middleware func
      await promisify(authMiddleware)(mockRequest, mockResponse);
    } catch (err) {
      error = err as AppError;
      // Expect auth middleware to throw error with non-existent user
      expect(error.message).to.equal('Invalid input - content does not exist');
    }
  });
});
