import mongoose from 'mongoose';
import User, {UserDocument} from '../models/user';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import * as mongooseRepository from '../services/mongooseRepository';

/**
 * Validates uuid submitted in req.headers
 * If uuid is an invalid ObjectId or the
 * user no longer exists, an error is thrown
 * If no uuid is provided, a new user is created
 * and their uuid is attached to the response
 */

export default catchAsync(async (req, res) => {
  // To set headers.uuid's type, we'd have to alter internal properties of the Request type
  const userId = req.headers.uuid as string;

  let user: UserDocument;
  if (!userId) {
    user = (await mongooseRepository.create(User)) as UserDocument;
  } else {
    // Validate user
    if (!mongoose.isValidObjectId(userId)) {
      // TODO: this doesn't need to know status codes. That's for the error-handling middleware to decide
      // add simplicity - give the apperror just the string, it must decide the code
      throw new AppError('Invalid input - user id', 401);
    }
    const dbUser = (await mongooseRepository.findById(User, userId)) as UserDocument;
    if (!dbUser) {
      throw new AppError('Invalid input - user does not exist', 404);
    }
    user = dbUser;
  }

  res.locals.user = user;
  res.append('uuid', user._id.toString());
});
