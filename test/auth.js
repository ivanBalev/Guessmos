require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const chai = require('chai');
const expect = chai.expect;
const { connect, disconnect } = require('../database');
const authMiddleware = require('../middlewares/auth');
const mongoose = require('mongoose');
const { promisify } = require('util');

describe('auth middleware', function () {
  // Create mock request & response objects
  let mockRequest = { headers: {} };
  let mockResponse = {
    headers: {},
    append: function (name, item) {
      this.headers[name] = item;
    },
  };

  this.beforeEach(async () => {
    // Connect to db and return response & request to default state
    await connect();
    mockRequest = { headers: {} };
    mockResponse.headers = {};
  });

  this.afterEach(async () => {
    await disconnect();
  });

  it('creates new user with no given uuid in request', async function () {
    await promisify(authMiddleware)(mockRequest, mockResponse);

    // Valid user
    expect(mockRequest.user).to.exist;
    expect(mongoose.isValidObjectId(mockRequest.user._id)).to.be.true;

    // Valid default user preference
    expect(mockRequest.user.wordLength).to.equal(5);
    expect(mockRequest.user.wordLanguage).to.equal('en');
    expect(mockRequest.user.attemptsCount).to.equal(6);
    
    // Valid response user attached
    expect(mockResponse.headers.uuid).to.exist;
    expect(mongoose.isValidObjectId(mockResponse.headers.uuid)).to.be.true;
  });

  it('throws errors correctly', async function () {
    // Create invalid ObjectId
    mockRequest.headers.uuid = 'invalidObjectId';
    let error;

    try {
      await promisify(authMiddleware)(mockRequest, mockResponse);
    } catch (err) {
      error = err;
    }
    
    // Expect auth middleware to throw error with invalid id
    expect(error.message).to.equal('Invalid input - user id');
    expect(error.status).to.equal('fail');

    // Create valid but non-existent ObjectId
    mockRequest.headers.uuid = mongoose.Types.ObjectId();
    try {
      await promisify(authMiddleware)(mockRequest, mockResponse);
    } catch (err) {
      error = err;
    }
    
    // Expect auth middleware to throw error with non-existent user
    expect(error.message).to.equal('Invalid input - user does not exist');
    expect(error.status).to.equal('fail');
  });
});
