import User from '../models/User';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import UserService from '../services/mongoose/UserService';

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

  let user: User;
  if (!userId) {
    user = (await UserService.createOne());
  } else {
    // Validate user
    // TODO: How does this casting thing work?
    const cleanDbUser = (await UserService.findById(userId));
    const dbUser = cleanDbUser as User;
    if (!dbUser) {
      throw new AppError('Invalid input - user does not exist', 404);
    }
    user = dbUser;
  }

  res.locals.user = user;
  res.append('uuid', user.id!.toString());
});
