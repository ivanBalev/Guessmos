import IModel from "./IModel";

export default interface IWord extends IModel {
  content: string;
  language: string;
  length: number;
}