import Guess from "../../models/Guess";
import User from "../../models/User";
import Word from "../../models/Word";

export default interface IGUessService {
  getByUser (user: User): Promise<Guess[]>,
  validateForUser (user: User, pastUserGuesses: string[], dayWord: string, word: Word): void,
  checkWord(userId: string, word: Word, dayWord: string): Promise<{ color: string; letter: string; }[]>,
  colorLetters(dayWord: string, word: string): {letter: string, color: string}[]
}