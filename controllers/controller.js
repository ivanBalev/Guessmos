const catchAsync = require('./../utils/catchAsync');
const dbService = require('./../services/dbService');

// Guess word of the day
const guess = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: await dbService.guess(req.body.word, req.user),
  });
});

// Get guesses for current day
const getUserState = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: await dbService.getUserState(req.user),
  });
});

// Set word language, length and number of attempts preference
const setPreference = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: await dbService.updateUser(req.user, req.body),
  });
});

module.exports = {
  guess,
  getUserState,
  setPreference,
};
