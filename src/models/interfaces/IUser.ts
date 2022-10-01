import IModel from "./IModel";

export default interface IUser extends IModel {
  wordLength?: number;
  wordLanguage?: string;
  attemptsCount?: number;
}