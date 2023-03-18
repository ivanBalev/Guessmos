import User from '../models/User';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import UserService, { IMongooseUser } from '../services/UserService';
import { Document, Types } from 'mongoose';

/**
 * Validates uuid submitted in req.headers
 * If uuid is an invalid ObjectId or the
 * user no longer exists, an error is thrown
 * If no uuid is provided, a new user is created
 * and their uuid is attached to the response
 */

export default catchAsync(async (req, res) => {

  const userId = req.headers.uuid as string;
  let user: User;

  if (!userId) {

    // If no uuid is provided by client, create new user
    user = await UserService.createOne();
  } else {

    // Try and get user from database
    let dbUser: (Document<unknown, any, IMongooseUser> & IMongooseUser & Required<{ _id: Types.ObjectId; }>) | null;
    try {
      dbUser = await UserService.findById(userId);
    }
    catch (err) {

      // Invalid mongoose ObjectId
      throw new AppError('Invalid input - malformed user id', 401);
    }
    if (!dbUser) {

      // Non-existent user
      throw new AppError('Invalid input - content does not exist', 404);
    }

    user = dbUser;
  }

  // Attach user to request locals
  res.locals.user = user;

  // Add uuid header to response for client to use in subsequent requests
  res.append('uuid', user.id!.toString());
});
