import express from 'express';
const router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// SwaggerJSDoc definition
const options = {
  swaggerDefinition: {
    info: {
      title: 'Guessmos',
      description: 'Wordle clone',
      version: '1.0.1',
    },
    host: process.env.URL?.slice(7),
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
        description: 'Get guesses for current day & set preference',
      },
    ],
  },
  apis: ['**/*.ts'],
};

const swaggerSpecification = swaggerJSDoc(options);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

export default router;
