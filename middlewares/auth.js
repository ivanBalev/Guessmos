const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('../models/user');
const mongoose = require('mongoose');
const mongooseRepository = require('../services/mongooseRepository');

module.exports = catchAsync(async (req, res) => {
  const userId = req.headers.uuid;
  let user = {};

  if (!userId) {
    user = await mongooseRepository.create(User);
  } else {
    // Validate user
    if (!mongoose.isValidObjectId(userId)) {
      throw new AppError('invalid user id', 401);
    }
    const dbUser = await mongooseRepository.findById(User, userId);
    if (!dbUser) {
      throw new AppError('user does not exist', 404);
    }
    user = dbUser;
  }

  req.user = user;
  res.append('uuid', user._id);
});
