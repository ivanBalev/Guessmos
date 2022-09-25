import { Schema, model, Types, Document } from 'mongoose';
// import {randomUUID} from 'crypto';

export interface IWord {
  id: string;
  content: string;
  language: string;
  length: number;
  dayWordDates: Date[];
}

interface IMongooseWord extends IWord {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type WordDocument = Document<Types.ObjectId> & IMongooseWord;

const wordSchema = new Schema<IMongooseWord>(
  {
    _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
    },
    content: {
      type: String,
      required: [true, 'Word must have content'],
    },
    language: {
      type: String,
      requred: [true, 'Word must have language'],
      enum: {
        values: ['en', 'bg'],
        message: 'Supported languages: en, bg',
      },
    },
    length: {
      type: Number,
      default: function () {
        return this.content.length;
      },
    },
    dayWordDates: [Date],
  },
  { timestamps: true }
);

wordSchema.pre('save', function(next) {
  // this.id = new randomUUID();

  return next();
})

const Word = model<IMongooseWord>('Word', wordSchema);

export default Word;
