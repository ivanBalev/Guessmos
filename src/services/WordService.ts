import { Schema, model, Types, Document, Model } from 'mongoose';
import Word from '../models/Word';

// Define properties added for db exclusively
interface IMongooseWord extends Word {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Type we receive back from db
export type WordDocument = Document<Types.ObjectId> & IMongooseWord;

// Define static custom functions attached to our model
interface WordStaticsModel extends Model<IMongooseWord> {
  findRandom(query: Object): Word,
}

const wordSchema:
  Schema<IMongooseWord, WordStaticsModel> =
  new Schema<IMongooseWord>(
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

wordSchema.static('findRandom', async function (query: Object) {
  // Get total number of documents
  const documentsCount = await WordModel.countDocuments(query);
  // Skip random number of documents
  const skip = Math.floor(Math.random() * documentsCount);
  // Get random document
  return await WordModel.find(query).skip(skip).findOne().lean() as Word;
});

const WordModel = model<IMongooseWord, WordStaticsModel>('Word', wordSchema);

export default WordModel;
