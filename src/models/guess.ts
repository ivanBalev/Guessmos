import { JSONSchemaType } from 'ajv';
import IGuess from './interfaces/IGuess';
import validate from './validation/validate';

export default class Guess implements IGuess  {
  id?: string;
  content: string;
  language: string;
  length: number;
  userId: string;
  wordId: string;

  constructor(guess: IGuess) {
    this.id = guess.id;
    this.content = guess.content;
    this.language = guess.language;
    this.userId = guess.userId;
    this.wordId = guess.wordId;
    this.length = this.content.length;

    validate(this);
  }
}

export const guessSchema: JSONSchemaType<Guess> = {
  type: 'object',
  title: 'Word',
  properties: {
    id: {type: 'string', nullable: true},
    content: {type: 'string'},
    language: {type: 'string', enum: ['en', 'bg']},
    length: {type: 'integer'},
    userId: {type: 'string'},
    wordId: {type: 'string'},
  },
  required: ['content', 'language', 'length', 'userId', 'wordId'],
  additionalProperties: false,
}
