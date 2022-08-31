require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const chai = require('chai');
const expect = chai.expect;
const { connect, disconnect } = require('../database');
const authMiddleware = require('../middlewares/auth');
const mongoose = require('mongoose');
const { promisify } = require('util');

describe('auth middleware', function () {
  let mockRequest = { headers: {} };
  let mockResponse = {
    headers: {},
    append: function (name, item) {
      this.headers[name] = item;
    },
  };

  this.beforeEach(async () => {
    await connect();
    mockRequest = { headers: {} };
    mockResponse.headers = {};
  });

  this.afterEach(async () => {
    await disconnect();
  });

  it('creates new user with no given uuid in request', async function () {
    await promisify(authMiddleware)(mockRequest, mockResponse);

    expect(mockRequest.user).to.exist;
    expect(mongoose.isValidObjectId(mockRequest.user._id)).to.be.true;
    expect(mockRequest.user.guessLength).to.equal(5);
    expect(mockRequest.user.guessLanguage).to.equal('en');
    expect(mockRequest.user.attemptsCount).to.equal(6);
    expect(mockResponse.headers.uuid).to.exist;
    expect(mongoose.isValidObjectId(mockResponse.headers.uuid)).to.be.true;
  });

  it('throws errors correctly', async function () {
    mockRequest.headers.uuid = 'invalidObjectId';
    let error;

    try {
      await promisify(authMiddleware)(mockRequest, mockResponse);
    } catch (err) {
      error = err;
    }
    expect(error.message).to.equal('invalid user id');
    expect(error.status).to.equal('fail');

    mockRequest.headers.uuid = mongoose.Types.ObjectId();
    try {
      await promisify(authMiddleware)(mockRequest, mockResponse);
    } catch (err) {
      error = err;
    }
    expect(error.message).to.equal('user does not exist');
    expect(error.status).to.equal('fail');
  });
});
