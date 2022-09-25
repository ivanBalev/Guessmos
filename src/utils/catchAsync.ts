// TODO: implement RequestHandler type
import { Request, Response, RequestHandler } from "express";

export default (func: (req: Request, res: Response) => Promise<void>) => {
const returnFn: RequestHandler = (req, res, next) => {
  // TODO: convert this to try/catch
  func(req, res)
    //TODO: using just next as argument triggers error handling
    .then(() => next())
    .catch(next);
};

  return returnFn;
};
