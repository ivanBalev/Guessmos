import validate from './validation/validate';

const defaultValues = {
  wordLength: 5,
  wordLanguage: 'en',
  attemptsCount: 20
}

export default class User {

  // Works as both inputModel and viewModel
  // That's why id is nullable (client doesn't always know it)
  id?: string;
  wordLength: number;
  wordLanguage: string;
  attemptsCount: number;

  constructor(user: User) {
    this.id = user.id;
    this.wordLength = user.wordLength ?? defaultValues.wordLength;
    this.wordLanguage = user.wordLanguage ?? defaultValues.wordLanguage;
    this.attemptsCount = user.attemptsCount ?? defaultValues.attemptsCount;
    validate(this);
  }
}
