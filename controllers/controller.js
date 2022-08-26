const dbService = require('./../services/dbService');
const catchAsync = require('./../utils/catchAsync');

const guess = catchAsync(async (req, res, next) => {
  const coloredGuess = await dbService.guess(req.body.word, req.user);
  return res.send(coloredGuess);
});

const getUserState = catchAsync(async (req, res, next) => {
  const coloredGuesses = await dbService.getUserState(req.user);
  return res.send(coloredGuesses);
});

const setPreference = catchAsync(async (req, res, next) => {
  res.send(await dbService.updateUser(req.user, req.body));
});

module.exports = {
  guess,
  getUserState,
  setPreference,
};
