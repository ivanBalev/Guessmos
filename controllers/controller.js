const dbService = require('./../services/dbService');
const catchAsync = require('./../utils/catchAsync');

const guess = catchAsync(async (req, res, next) => {
  return res.send(await dbService.guess(req.body.word, req.user));
});

const getUserState = catchAsync(async (req, res, next) => {
  return res.send(await dbService.getUserState(req.user));
});

const setPreference = catchAsync(async (req, res, next) => {
  return res.send(await dbService.updateUser(req.user, req.body));
});

module.exports = {
  guess,
  getUserState,
  setPreference,
};
