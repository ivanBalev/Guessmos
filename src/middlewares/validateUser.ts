import User from "../models/User";
import catchAsync from "../utils/catchAsync";
import { Request } from "express";

export default catchAsync(async (req: Request, res) => {

  // Get user (we have it from auth middleware)
  const user = res.locals.user;

  // Get submitted preference
  const preference = req.body;

  // Validate data
  {
    // These properties are required; if client hasn't submitted all three,
    // we need to set them at their current values from db
    user.wordLength = preference.wordLength ?? user.wordLength;
    user.wordLanguage = preference.wordLanguage ?? user.wordLanguage;
    user.attemptsCount = preference.attemptsCount ?? user.attemptsCount;
  }
  
  // Validate by creating model (ajv ctor validation)
  const updatedUser = new User(user);

  // Attach to response object
  res.locals.user = updatedUser;
})