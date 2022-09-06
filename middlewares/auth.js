const mongoose = require('mongoose');
const User = require('../models/user');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const mongooseRepository = require('../services/mongooseRepository');

/**
 * Validates uuid submitted in req.headers
 * If uuid is an invalid ObjectId or the
 * user no longer exists, an error is thrown
 * If no uuid is provided, a new user is created
 * and their uuid is attached to the response
 */
module.exports = catchAsync(async (req, res) => {
  const userId = req.headers.uuid;
  let user = {};

  if (!userId) {
    user = await mongooseRepository.create(User);
  } else {
    // Validate user
    if (!mongoose.isValidObjectId(userId)) {
      throw new AppError('Invalid input - user id', 401);
    }
    const dbUser = await mongooseRepository.findById(User, userId);
    if (!dbUser) {
      throw new AppError('Invalid input - user does not exist', 404);
    }
    user = dbUser;
  }

  req.user = user;
  res.append('uuid', user._id);
});
