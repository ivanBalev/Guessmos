import validate from './validation/validate';

export default class Guess {

  // Works as both inputModel and viewModel
  // That's why id is nullable (client doesn't always know it)
  id?: string;
  content: string;
  language: string;
  length: number;
  userId: string;
  wordId: string;

  constructor(guess: Guess) {
    this.id = guess.id;
    this.content = guess.content;
    this.language = guess.language;
    this.userId = guess.userId;
    this.wordId = guess.wordId;
    this.length = this.content.length;

    validate(this);
  }
}