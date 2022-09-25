import {Schema, Types, model, Document} from 'mongoose';

const constants = {
  minWordLength: 5,
  maxWordLength: 12,
  minAttemptsCount: 6,
  maxAttemptsCount: 50,
  languages: { en: 'en', bg: 'bg' },
};

interface IUser {
  _id: Types.ObjectId;
  wordLanguage: string;
  wordLength: number;
  attemptsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = Document<Types.ObjectId> & IUser;

const userSchema = new Schema<IUser>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    wordLength: {
      type: Number,
      default: constants.minWordLength,
      min: [
        constants.minWordLength,
        `Word length must be above ${constants.minWordLength - 1}`,
      ],
      max: [
        constants.maxWordLength,
        `Word length must be below ${constants.maxWordLength + 1}`,
      ],
    },
    wordLanguage: {
      type: String,
      default: constants.languages.en,
      enum: {
        values: Object.values(constants.languages),
        message: 'Unsupported language',
      },
    },
    attemptsCount: {
      type: Number,
      default: constants.minAttemptsCount,
      min: [
        constants.minAttemptsCount,
        `Attempts must be above ${constants.minAttemptsCount - 1}`,
      ],
      max: [
        constants.maxAttemptsCount,
        `Attempts must be below ${constants.maxAttemptsCount + 1}`,
      ],
    },
  },
  { timestamps: true }
);

const User = model<IUser>('User', userSchema);

export default User;
