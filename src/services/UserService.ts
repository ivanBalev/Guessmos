import { Schema, Types, model, Document, Model } from 'mongoose';
import User from '../models/User';

const constants = {
  minWordLength: 5,
  maxWordLength: 12,
  minAttemptsCount: 6,
  maxAttemptsCount: 50,
  languages: { en: 'en', bg: 'bg' },
};

// Define properties added for db exclusively
export interface IMongooseUser extends User {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Type we receive back from db
export type UserDocument = Document<Types.ObjectId> & IMongooseUser;

// Define static custom functions attached to our model
interface UserStaticsModel extends Model<IMongooseUser> {
  createOne(user?: User): User,
}

const userSchema = new Schema<IMongooseUser, UserStaticsModel>(
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

userSchema.static('createOne', async function (user?: User) {
  // Return created user, mapped to User input/view model(we don't need all properties returned from db)
  return await new UserModel(user).save() as User;
});

const UserModel = model<IMongooseUser, UserStaticsModel>('User', userSchema);
export default UserModel;
