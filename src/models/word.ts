import validate from './validation/validate';

export default class Word {
  
  // Works as both inputModel and viewModel
  // That's why id is nullable (client doesn't always know it)
  id?: string;
  content: string;
  language: string;
  length: number;
  dayWordDates?: Date[];

  constructor(word: Word) {
    this.id = word.id;
    this.content = word.content;
    this.language = word.language;
    this.length = word.length;
    this.dayWordDates = [];

    validate(this);
  }
}
