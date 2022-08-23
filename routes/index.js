const express = require('express');
const router = express.Router();

const controller = require('./../controllers/controller');

router.get('/state', controller.getState);
router.post('/guess', controller.guess);
router.post('/preference', controller.setPreference);

module.exports = router;
