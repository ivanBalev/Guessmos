import express from 'express';
import validateUser from '../middlewares/validateUser';
const router = express.Router();

import * as controller from './../controllers/controller';
import authMiddleware from './../middlewares/auth';
import validateGuess from './../middlewares/validateGuess';
import docs from './docs';

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
 *         description: Malformed user id
 *       404:
 *         description: Non-existent input
 */
router.get('/state', authMiddleware, controller.getState);

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
 *         description: Input validation failed
 *       401:
 *         description: Malformed user id
 *       404:
 *         description: Non-existent input
 */
router.post('/preference', authMiddleware, validateUser, controller.setPreference);

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
 *         description: Word does not meet requirements
 *       401:
 *         description: Malformed user id
 *       404:
 *         description: Non-existent input
 */
router.post('/guess', authMiddleware, validateGuess, controller.guess);

// API documentation in development environment
if (process.env.NODE_ENV === 'development') {
  router.use('/docs', docs);
}

export default router;
