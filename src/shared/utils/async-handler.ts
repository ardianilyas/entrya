import type { NextFunction, Request, Response } from "express";

export function asyncHandler<Req extends Request = Request>(
  fn: (
    req: Req, 
    res: Response, 
    next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as Req, res, next)).catch(next);
  };
}
