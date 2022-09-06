const express = require('express');
const router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Guessmos',
      description: 'Wordle clone',
      version: '1.0.1',
    },
    host: process.env.URL.slice(7),
    tags: [
      {
        name: 'guess',
        description: 'Guess word of the day',
      },
      {
        name: 'preference',
        description:
          'Set word language, length and number of attempts preference',
      },
      {
        name: 'state',
        description: 'Get guesses for current day',
      },
      {
        name: 'info',
        description: 'General API info',
      },
    ],
  },
  apis: ['./routes/**/*.js'],
};

const swaggerSpecification = swaggerJSDoc(options);

/**
 * @swagger
 * /docs:
 *    get:
 *      tags:
 *      - info
 *      description: Project documentation.
 */
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

module.exports = router;
