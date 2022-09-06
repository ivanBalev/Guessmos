const express = require('express');
const router = express.Router();

const controller = require('./../controllers/controller');
const authMiddleware = require('./../middlewares/auth');

/**
 * @swagger
 * /state:
 *   get:
 *     tags:
 *       - state
 *     parameters:
 *      - name: uuid
 *        description: user id
 *        in: header
 *        required: false
 *        type: string
 *        format: ObjectId
 *     responses:
 *       200:
 *         description: OK
 *         headers:
 *           uuid:
 *             schema:
 *               type: string
 *               format: ObjectId
 *             description: user id
 *       401:
 *         description: Invalid input - user id
 *       404:
 *         description: Invalid input
 */
router.get('/state', authMiddleware, controller.getUserState);

/**
 * @swagger
 * /preference:
 *   post:
 *     tags:
 *       - preference
 *     parameters:
 *      - name: uuid
 *        description: user id
 *        in: header
 *        required: false
 *        type: string
 *        format: ObjectId
 *      - name: body
 *        description: preference for word length, language and number of guesses
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *            wordLength:
 *              type: number
 *              example: 7
 *            wordLanguage:
 *              type: string
 *              example: bg
 *            attemptsCount:
 *              type: number
 *              example: 20
 *     responses:
 *       200:
 *         description: OK
 *         headers:
 *           uuid:
 *             schema:
 *               type: string
 *               format: ObjectId
 *             description: user id
 *       400:
 *         description: User validation failed
 *       401:
 *         description: Invalid input - user id
 *       404:
 *         description: Invalid input
 */
router.post('/preference', authMiddleware, controller.setPreference);

/**
 * @swagger
 * /guess:
 *   post:
 *     tags:
 *       - guess
 *     parameters:
 *      - name: uuid
 *        description: user id
 *        in: header
 *        required: false
 *        type: string
 *        format: ObjectId
 *      - name: body
 *        description: user's guess
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *            word:
 *              type: string
 *              example: utter
 *     responses:
 *       200:
 *         description: OK
 *         headers:
 *           uuid:
 *             schema:
 *               type: string
 *               format: ObjectId
 *             description: user id
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid input - user id
 *       404:
 *         description: Invalid input
 */
router.post('/guess', authMiddleware, controller.guess);

// API documentation in development environment
if (process.env.NODE_ENV === 'development') {
  router.use('/docs', require('./docs'));
}

module.exports = router;
