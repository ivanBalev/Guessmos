import {Schema, Types, model, Document, Model } from 'mongoose';
import User from '../../models/User';
import IUser from '../../models/User';

const constants = {
  minWordLength: 5,
  maxWordLength: 12,
  minAttemptsCount: 6,
  maxAttemptsCount: 50,
  languages: { en: 'en', bg: 'bg' },
};

interface IMongooseUser extends IUser {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = Document<Types.ObjectId> & IMongooseUser;

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

userSchema.static('createOne', async function(user?: User) {
  const userDoc = await new UserModel(user).save();
  // TODO: mongoose needs to be removed
  return new User({
    id: userDoc.id,
    wordLanguage: userDoc.wordLanguage,
    wordLength: userDoc.wordLength,
    attemptsCount: userDoc.attemptsCount})
});

const UserModel = model<IMongooseUser, UserStaticsModel>('User', userSchema);

export default UserModel;
