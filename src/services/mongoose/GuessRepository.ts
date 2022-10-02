import { Schema, model, Types } from 'mongoose';
import Guess from '../../models/Guess';

// TODO: Mongoose needs to be removed. Pure MongoDB engine needed.

// TODO: Use mongoose to validate data coming back from db.
// that way we'll have validation on both write and read.
interface IMongooseGuess extends Guess {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const guessSchema = new Schema<IMongooseGuess>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    content: {
      type: String,
      required: [true, 'Guess must have content'],
    },
    language: {
      type: String,
      requred: true,
    },
    userId: {
      type: String,
      ref: 'User',
      requred: true,
    },
    wordId: {
      type: String,
      ref: 'Word',
      required: true,
    },
  },
  { timestamps: true }
);

const GuessModel = model<IMongooseGuess>('Guess', guessSchema);

export default GuessModel;
