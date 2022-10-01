import IModel from "./IModel";

export default interface IGuess extends IModel {
  content: string;
  language: string;
  length: number;
  userId: string;
  wordId: string;
}