import { NextFunction, Request, Response } from 'express';

const fakeAuth = (req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '636f17425278a760095c18a5',
  };
  next();
};

export default fakeAuth;
