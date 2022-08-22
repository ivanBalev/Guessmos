const express = require('express');
const router = express.Router();

const guessDayWord = require('./guess');
const getUserState = require('./state');
const setUserPreference = require('./preference');

router.get('/state', getUserState);
router.post('/guess', guessDayWord);
router.post('/preference', setUserPreference);

module.exports = router;
