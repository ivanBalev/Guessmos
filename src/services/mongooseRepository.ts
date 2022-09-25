import { FilterQuery, Model } from 'mongoose';
import { UserDocument } from '../models/user';
import { GuessDocument } from '../models/guess';
import { WordDocument } from '../models/word';

type AppDocument = UserDocument | GuessDocument | WordDocument;

export async function findOne<T extends Model<any>>(model: T, query: FilterQuery<AppDocument>): Promise<AppDocument | null> {
  return await model.findOne(query);
}

export async function findById<T extends Model<any>>(model: T, id: string): Promise<AppDocument | null> {
  return await model.findById(id);
}

export async function findRandom<T extends Model<any>>(model: T, query: FilterQuery<AppDocument>): Promise<AppDocument | null> {
  // Get total number of documents
  const documentsCount = await model.countDocuments(query);
  // Skip random number of documents
  const skip = Math.floor(Math.random() * documentsCount);
  // Get random document
  return await model.find(query).skip(skip).findOne();
}

export async function findMany<T extends Model<any>>(model: T, query: FilterQuery<AppDocument>): Promise<AppDocument[]> {
  return await model.find(query);
}

export async function create<T extends Model<any>>(model: T, object: object = {}): Promise<AppDocument> {
  return await new model(object).save();
}

// TODO: last 2 functions need typing
export async function update(document: AppDocument, object: object): Promise<void> {
  await document.updateOne(object, {runValidators: true});
}
