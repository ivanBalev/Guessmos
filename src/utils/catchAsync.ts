import { Request, Response, RequestHandler } from "express";

// Simplified controller error handling 
export default (func: (req: Request, res: Response) => Promise<void>) => {
  const returnFn: RequestHandler = (req, res, next) => {
    func(req, res)
      .then(() => next())
      .catch(next);
  };

  return returnFn;
};
