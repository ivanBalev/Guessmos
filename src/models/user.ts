import { JSONSchemaType } from 'ajv';
import IUser from './interfaces/IUser';
import validate from './validation/validate';

// TODO: implement factory for each model for better control of instantiation process
export default class User implements IUser {
  id?: string;
  wordLength: number;
  wordLanguage: string;
  attemptsCount: number;

  constructor(user: IUser) {
    this.id = user.id;
    this.wordLength = user.wordLength ?? 5;
    this.wordLanguage = user.wordLanguage ?? 'en';
    this.attemptsCount = user.attemptsCount ?? 20;
    validate(this);
  }
}

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
