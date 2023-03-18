import Ajv from "ajv";
import ajvErrors from 'ajv-errors';
const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);
import AppError from "../../utils/appError";

// Initialize schemas collection
const modelSchemas: { [key: string]: Object } = {
  Word: {
    type: 'object',
    title: 'Word',
    properties: {
      id: { type: 'string', nullable: true },
      content: { type: 'string' },
      language: { type: 'string' },
      length: { type: 'integer' },
    },
    required: ['content', 'language', 'length'],
    additionalProperties: true,
  },
  Guess: {
    type: 'object',
    title: 'Word',
    properties: {
      id: { type: 'string', nullable: true },
      content: { type: 'string' },
      language: { type: 'string', enum: ['en', 'bg'] },
      length: { type: 'integer' },
      userId: { type: 'string' },
      wordId: { type: 'string' },
    },
    required: ['content', 'language', 'length', 'userId', 'wordId'],
    additionalProperties: false,
  },
  User: {
    type: 'object',
    title: 'User',
    properties: {
      id: { type: 'string', nullable: true },
      wordLanguage: { type: 'string', enum: ['en', 'bg'] },
      wordLength: { type: 'integer', maximum: 12, minimum: 5 },
      attemptsCount: { type: 'integer', maximum: 50, minimum: 2 },
    },
    errorMessage: {
      properties: {
        wordLanguage: 'wordLanguage can be either \'en\' or \'bg\'',
      },
    },
    required: ['wordLanguage', 'wordLength', 'attemptsCount'],
    additionalProperties: false,
  }
}

// Validate input data against schema
export default function validate(data: Object) {

  // Get the schema name = the input constructor's name
  const schemaName = data.constructor.name;

  // Assert the schema exists in our schemas collection
  if (!Object.keys(modelSchemas).includes(schemaName)) {
    throw new AppError('Object schema does not exist in validation file', 500)
  }

  // Validate input
  const checkIfValid = ajv.compile(modelSchemas[schemaName]);
  if (checkIfValid(data)) {
    return true;
  }

  // Throw all errors from validation result
  for (const err of checkIfValid.errors as { instancePath: string, message: string }[]) {
    throw new AppError(`${err.instancePath.slice(1)} ${err.message} `, 400);
  }
}
