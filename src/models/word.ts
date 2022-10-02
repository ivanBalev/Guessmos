import { JSONSchemaType } from 'ajv';
import IWord from './interfaces/IWord';
import validate from './validation/validate';

export default class Word implements IWord {
  // Under more complex circumstances
  // an InputModel & ServiceModel would be needed
  id?: string;
  content: string;
  language: string;
  length: number;
  dayWordDates?: Date[];

  // TODO: Should we add id automatically, regardless of db implementation?
  // import crypto and create new id on initialization?
  constructor(word: IWord) {
    this.id = word.id;
    this.content = word.content;
    this.language = word.language;
    this.length = word.length;
    this.dayWordDates = [];

    validate(this);
  }
}

// dayWordDates are set only long after object creation
// Words are created only when seeding(no direct interaction with user)
export const wordSchema: JSONSchemaType<Omit<Word, 'dayWordDates'>> = {
  type: 'object',
  title: 'Word',
  properties: {
    id: {type: 'string', nullable: true},
    content: {type: 'string'},
    language: {type: 'string'},
    length: {type: 'integer'},
  },
  required: ['content', 'language', 'length'],
  // TODO: Will this be needed for dayWordDates?
  additionalProperties: true,
}
