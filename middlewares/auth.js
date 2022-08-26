const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('../models/user');
const mongoose = require('mongoose');

module.exports = catchAsync(async (req, res, next) => {
  const userId = req.headers.uuid;
  let user = {};

  if (!userId) {
    user = await new User().save();
  } else {
    // Validate user
    if (!mongoose.isValidObjectId(userId)) {
      throw new AppError('invalid user id');
    }
    const dbUser = await User.findById(userId);
    if (!dbUser) {
      throw new AppError('user does not exist');
    }
    user = dbUser;
  }

  req.user = user;
  res.append('uuid', user._id);
  next();
});
