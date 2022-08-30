const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../index');
const { connect, disconnect } = require('../database');
const authMiddleware = require('../middlewares/auth');
const mongoose = require('mongoose');
const { promisify } = require('util');

describe('auth middleware', function () {
  this.beforeEach(async () => {
    await connect();
  });

  this.afterEach(async () => {
    await disconnect();
  });

  it('creates new user with no given uuid in request', async function () {
    let mockRequest = { headers: {} };
    let mockResponse = {
      headers: {},
      append: function (name, item) {
        this.headers[name] = item;
      },
    };

    await promisify(authMiddleware)(mockRequest, mockResponse);

    expect(mockRequest.user).to.exist;
    expect(mongoose.isValidObjectId(mockRequest.user._id)).to.be.true;
    expect(mockResponse.headers.uuid).to.exist;
    expect(mongoose.isValidObjectId(mockResponse.headers.uuid)).to.be.true;
  });
});
