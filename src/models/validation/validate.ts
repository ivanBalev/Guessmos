import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();
import IModel from "../interfaces/IModel";
import {guessSchema} from '../Guess';
import {wordSchema} from '../Word';
import User from "../User";
import AppError from "../../utils/appError";

// TODO: Import this, it was just a bug why I typed it this way
export const userSchema: JSONSchemaType<User> = {
  type: 'object',
  title: 'User',
  properties: {
    id: {type: 'string', nullable: true},
    wordLanguage: {type: 'string', enum: ['en', 'bg']},
    wordLength: {type: 'integer', maximum: 12, minimum: 5},
    attemptsCount: {type: 'integer', maximum: 50, minimum: 2},
  },
  required: ['wordLanguage', 'wordLength', 'attemptsCount'],
  additionalProperties: false,
}

const modelSchemas:{[key: string]: Object} = {
  Word: wordSchema,
  Guess: guessSchema,
  User: userSchema
}

// TODO: this can be implemented in a middleware to validate data from certain endpoints
export default function validate(data: IModel) {
  const schemaName = data.constructor.name;
  if(!Object.keys(modelSchemas).includes(schemaName)) {
    throw new AppError('Object schema does not exist in validation file', 500)
  }

  // TODO: compile validate fn in advance
  const checkIfValid = ajv.compile(modelSchemas[schemaName]);
  
  if(checkIfValid(data)) {
    return true;
  }

  // TODO: this needs better typing
  for (const err of checkIfValid.errors as {instancePath: string, message: string}[]) {
    throw new AppError(`${err.instancePath.slice(1)} ${err.message} `, 400);
  }
}
