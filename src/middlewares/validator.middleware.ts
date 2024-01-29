import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

class ValidatorMiddleware {
  /**
   * Validates request body against provided zodSchema
   * @param {z.ZodTypeAny} zodSchema
   * @returns
   */
  public validateRequestBody(zodSchema: z.ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction) => {
      zodSchema.parse(req.body);
      next();
    };
  }

  /**
   * Validates request params against provided zodSchema
   * @param {z.ZodTypeAny} zodSchema
   * @returns
   */
  public validateRequestParams(zodSchema: z.ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction) => {
      zodSchema.parse(req.params);
      next();
    };
  }

  /**
   * Validates request query against provided zodSchema
   * @param {z.ZodTypeAny} zodSchema
   * @returns
   */
   public validateRequestQuery(zodSchema: z.ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction) => {
      zodSchema.parse(req.query);
      next();
    };
  }
}

export default ValidatorMiddleware;
