const express = require('express');
const router = express.Router();

const guessDayWord = require('../route_handlers/guess');
const getUserState = require('../route_handlers/state');
const setUserPreference = require('../route_handlers/preference');

router.get('/state', getUserState);
router.post('/guess', guessDayWord);
router.post('/preference', setUserPreference);

module.exports = router;
