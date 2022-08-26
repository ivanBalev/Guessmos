const express = require('express');
const router = express.Router();

const controller = require('./../controllers/controller');
const authMiddleware = require('./../middlewares/auth');

router.get('/state', authMiddleware, controller.getUserState);
router.post('/preference', authMiddleware, controller.setPreference);
router.post('/guess', authMiddleware, controller.guess);

module.exports = router;
